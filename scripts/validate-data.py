from pathlib import Path
import json
import math
import sys

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "public" / "data" / "tuition-comparison.json"
records = json.loads(path.read_text(encoding="utf-8"))

errors = []
if len(records) != 206:
    errors.append(f"비교 대상 수가 206이 아닙니다: {len(records)}")

counts = {key: sum(r["changeType"] == key for r in records) for key in ["상승", "동결", "하락"]}
expected = {"상승": 177, "동결": 11, "하락": 18}
if counts != expected:
    errors.append(f"변동 분포 불일치: {counts}")

for index, record in enumerate(records):
    required = ["school", "region", "establishment", "tuition2025", "tuition2026", "difference", "rate"]
    for key in required:
        if key not in record:
            errors.append(f"{index}번 레코드에 {key}가 없습니다.")
    for key in ["tuition2025", "tuition2026", "difference", "rate"]:
        if not math.isfinite(record[key]):
            errors.append(f"{record.get('school')}의 {key}가 유한한 숫자가 아닙니다.")
    if record["tuition2025"] <= 0 or record["tuition2026"] <= 0:
        errors.append(f"{record['school']}의 등록금이 0원 이하입니다.")
    if abs((record["tuition2026"] - record["tuition2025"]) - record["difference"]) > 0.2:
        errors.append(f"{record['school']}의 증감액이 일치하지 않습니다.")

if errors:
    print("\\n".join(errors))
    sys.exit(1)

print(f"데이터 검증 통과: {len(records)}개, {counts}")
