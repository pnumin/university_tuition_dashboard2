import Plot from 'react-plotly.js';
import { useDashboard } from '../../app/DashboardContext';
import { topSchools } from '../../domain/tuition.calculations';
import { formatManwon } from '../../domain/tuition.formatters';
import { ChartCard } from './ChartCard';

const colors = {
  navy: '#17365D',
  blue: '#2F5597',
  sky: '#5B9BD5',
  orange: '#ED7D31',
  red: '#C00000',
  green: '#548235',
  gray: '#A5A5A5',
};

const config = { responsive: true, displayModeBar: false };
const font = { family: '"Segoe UI","Noto Sans KR","Malgun Gothic",sans-serif', color: '#344054' };

function commonLayout(height = 330) {
  return {
    autosize: true,
    height,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font,
    margin: { l: 55, r: 25, t: 20, b: 50 },
    xaxis: { gridcolor: '#E8EDF4' },
    yaxis: { gridcolor: '#E8EDF4' },
  };
}

export function AverageTuitionChart() {
  const { kpis } = useDashboard();
  return (
    <ChartCard title="평균 등록금 비교" description="현재 필터 대상의 학교별 단순 평균">
      <Plot
        data={[{
          type: 'bar',
          x: ['2025년', '2026년'],
          y: [kpis.average2025 / 10_000, kpis.average2026 / 10_000],
          marker: { color: [colors.gray, colors.blue] },
          text: [formatManwon(kpis.average2025), formatManwon(kpis.average2026)],
          textposition: 'outside',
          hovertemplate: '%{x}<br>%{text}<extra></extra>',
        }]}
        layout={{ ...commonLayout(300), showlegend: false, yaxis: { title: { text: '만원' }, gridcolor: '#E8EDF4' } }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}

export function ChangeDistributionChart() {
  const { filteredRecords } = useDashboard();
  const labels = ['상승', '동결', '하락'];
  const values = labels.map((label) => filteredRecords.filter((record) => record.changeType === label).length);

  return (
    <ChartCard title="등록금 변동 학교 수" description="상승·동결·하락 학교 및 캠퍼스">
      <Plot
        data={[{
          type: 'pie',
          labels,
          values,
          hole: 0.55,
          marker: { colors: [colors.red, colors.gray, colors.green] },
          textinfo: 'label+value+percent',
          hovertemplate: '%{label}: %{value}곳 (%{percent})<extra></extra>',
        }]}
        layout={{ ...commonLayout(300), margin: { l: 10, r: 10, t: 15, b: 15 }, showlegend: false }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}

export function TuitionScatterChart() {
  const { filteredRecords } = useDashboard();
  const maxValue = Math.max(1, ...filteredRecords.flatMap((record) => [record.tuition2025, record.tuition2026])) / 10_000;

  return (
    <ChartCard title="2025년 대비 2026년 위치" description="대각선 위는 등록금이 상승한 학교입니다.">
      <Plot
        data={[
          {
            type: 'scatter',
            mode: 'markers',
            x: filteredRecords.map((record) => record.tuition2025 / 10_000),
            y: filteredRecords.map((record) => record.tuition2026 / 10_000),
            text: filteredRecords.map((record) => record.school),
            customdata: filteredRecords.map((record) => [
              record.difference,
              record.rate,
              record.region,
              record.establishment,
            ]),
            marker: {
              size: 9,
              color: filteredRecords.map((record) => record.rate),
              colorscale: [[0, colors.green], [0.5, colors.sky], [1, colors.red]],
              showscale: true,
              colorbar: { title: { text: '증감률' } },
              line: { color: '#fff', width: 0.5 },
            },
            hovertemplate:
              '<b>%{text}</b><br>2025: %{x:.1f}만원<br>2026: %{y:.1f}만원' +
              '<br>증감: %{customdata[0]:,.0f}원 (%{customdata[1]:.2f}%)' +
              '<br>%{customdata[2]} · %{customdata[3]}<extra></extra>',
          },
          {
            type: 'scatter',
            mode: 'lines',
            x: [0, maxValue * 1.05],
            y: [0, maxValue * 1.05],
            line: { dash: 'dash', color: '#98A2B3' },
            hoverinfo: 'skip',
            showlegend: false,
          },
        ]}
        layout={{
          ...commonLayout(390),
          showlegend: false,
          xaxis: { title: { text: '2025년 등록금(만원)' }, gridcolor: '#E8EDF4' },
          yaxis: { title: { text: '2026년 등록금(만원)' }, gridcolor: '#E8EDF4' },
        }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}

export function TopSchoolsChart() {
  const { filteredRecords } = useDashboard();
  const top = topSchools(filteredRecords).reverse();

  return (
    <ChartCard title="2026년 등록금 상위 15곳" description="현재 필터 내 학교·캠퍼스">
      <Plot
        data={[{
          type: 'bar',
          orientation: 'h',
          y: top.map((record) => record.school),
          x: top.map((record) => record.tuition2026 / 10_000),
          marker: { color: colors.orange },
          customdata: top.map((record) => [record.difference, record.rate]),
          hovertemplate:
            '<b>%{y}</b><br>2026: %{x:.1f}만원' +
            '<br>증감: %{customdata[0]:,.0f}원 (%{customdata[1]:.2f}%)<extra></extra>',
        }]}
        layout={{
          ...commonLayout(390),
          showlegend: false,
          margin: { l: 165, r: 20, t: 15, b: 45 },
          xaxis: { title: { text: '만원' }, gridcolor: '#E8EDF4' },
          yaxis: { automargin: true },
        }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}

export function RegionAverageChart() {
  const { regionSummaries } = useDashboard();
  const data = [...regionSummaries].sort((a, b) => a.average2026 - b.average2026);

  return (
    <ChartCard title="지역별 2026년 평균 등록금" description="지역별 학교·캠퍼스 단순 평균" tall>
      <Plot
        data={[{
          type: 'bar',
          orientation: 'h',
          y: data.map((item) => item.region),
          x: data.map((item) => item.average2026 / 10_000),
          marker: { color: colors.blue },
          text: data.map((item) => formatManwon(item.average2026)),
          textposition: 'outside',
          customdata: data.map((item) => item.count),
          hovertemplate: '%{y}<br>%{x:.1f}만원<br>비교 %{customdata}곳<extra></extra>',
        }]}
        layout={{
          ...commonLayout(500),
          showlegend: false,
          margin: { l: 70, r: 80, t: 15, b: 45 },
          xaxis: { title: { text: '만원' }, gridcolor: '#E8EDF4' },
        }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}

export function RegionDifferenceChart() {
  const { regionSummaries } = useDashboard();
  const data = [...regionSummaries].sort((a, b) => a.averageDifference - b.averageDifference);

  return (
    <ChartCard title="지역별 평균 증가액" description="2025년 대비 평균 증가액" tall>
      <Plot
        data={[{
          type: 'bar',
          orientation: 'h',
          y: data.map((item) => item.region),
          x: data.map((item) => item.averageDifference / 10_000),
          marker: { color: data.map((item) => item.averageDifference >= 0 ? colors.red : colors.green) },
          text: data.map((item) => formatManwon(item.averageDifference)),
          textposition: 'outside',
          hovertemplate: '%{y}<br>%{x:.1f}만원<extra></extra>',
        }]}
        layout={{
          ...commonLayout(500),
          showlegend: false,
          margin: { l: 70, r: 80, t: 15, b: 45 },
          xaxis: { title: { text: '증감액(만원)' }, gridcolor: '#E8EDF4' },
        }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}

export function MajorComparisonChart() {
  const { majorSummaries } = useDashboard();

  return (
    <ChartCard title="계열별 평균 등록금 비교" description="두 연도 계열 값이 모두 있는 학교만 포함">
      <Plot
        data={[
          {
            type: 'bar',
            name: '2025년',
            x: majorSummaries.map((item) => item.major),
            y: majorSummaries.map((item) => item.average2025 / 10_000),
            marker: { color: colors.gray },
            customdata: majorSummaries.map((item) => item.count),
            hovertemplate: '%{x} 2025<br>%{y:.1f}만원<br>비교 %{customdata}곳<extra></extra>',
          },
          {
            type: 'bar',
            name: '2026년',
            x: majorSummaries.map((item) => item.major),
            y: majorSummaries.map((item) => item.average2026 / 10_000),
            marker: { color: colors.blue },
            customdata: majorSummaries.map((item) => item.count),
            hovertemplate: '%{x} 2026<br>%{y:.1f}만원<br>비교 %{customdata}곳<extra></extra>',
          },
        ]}
        layout={{
          ...commonLayout(390),
          barmode: 'group',
          yaxis: { title: { text: '평균 등록금(만원)' }, gridcolor: '#E8EDF4' },
          legend: { orientation: 'h', y: 1.12 },
        }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}
