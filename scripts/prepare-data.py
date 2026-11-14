from pathlib import Path
import json
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUTPUT = ROOT / "public" / "data"
MAJORS = ["인문사회", "자연과학", "예체능", "공학", "의학"]

def load_clean(path: Path) -> pd.DataFrame:
    data = pd.read_excel(path, header=3, skiprows=[4])
    data = data.rename(columns={"수업료\n(B)": "수업료", "등록금\n(D=B)": "등록금"})
    for column in ["학교종류", "설립구분", "지역", "상태", "학교"]:
        data[column] = data[column].astype(str).str.strip()
    for column in ["기준연도", "수업료", "등록금", *MAJORS]:
        data[column] = pd.to_numeric(data[column], errors="coerce")
    return data

d25 = load_clean(RAW / "tuition_2025.xlsx")
d26 = load_clean(RAW / "tuition_2026.xlsx")
u25 = d25[(d25["학교종류"] == "대학교") & (d25["등록금"] > 0)].copy()
u26 = d26[(d26["학교종류"] == "대학교") & (d26["등록금"] > 0)].copy()

columns = ["학교", "설립구분", "지역", "상태", "등록금", *MAJORS]
matched = u25[columns].merge(u26[columns], on="학교", suffixes=("_2025", "_2026"))
matched["증감액"] = matched["등록금_2026"] - matched["등록금_2025"]
matched["증감률"] = matched["증감액"] / matched["등록금_2025"] * 100
matched["변동"] = np.select(
    [matched["증감액"] > 1, matched["증감액"] < -1],
    ["상승", "하락"],
    default="동결",
)

records = []
for _, row in matched.iterrows():
    records.append({
        "school": row["학교"],
        "region": row["지역_2026"],
        "establishment": row["설립구분_2026"],
        "status": row["상태_2026"],
        "tuition2025": round(float(row["등록금_2025"]), 1),
        "tuition2026": round(float(row["등록금_2026"]), 1),
        "difference": round(float(row["증감액"]), 1),
        "rate": round(float(row["증감률"]), 6),
        "changeType": row["변동"],
        "majors": {
            major: {
                "tuition2025": round(float(row[f"{major}_2025"]), 1),
                "tuition2026": round(float(row[f"{major}_2026"]), 1),
            }
            for major in MAJORS
        },
    })

OUTPUT.mkdir(parents=True, exist_ok=True)
(OUTPUT / "tuition-comparison.json").write_text(
    json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(f"{len(records)}개 비교 레코드를 생성했습니다.")
