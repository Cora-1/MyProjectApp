import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ScoreRadarChartProps {
  tone: number;
  empathy: number;
  clarity: number;
  confidence: number;
}

const ScoreRadarChart: React.FC<ScoreRadarChartProps> = ({ tone, empathy, clarity, confidence }) => {
  const data = [
    { subject: 'Tone', A: tone, fullMark: 100 },
    { subject: 'Empathy', A: empathy, fullMark: 100 },
    { subject: 'Clarity', A: clarity, fullMark: 100 },
    { subject: 'Confidence', A: confidence, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="subject" stroke="hsl(var(--foreground))" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
        <Radar name="Your Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--card-foreground))',
            borderRadius: 'var(--radius)',
          }}
          itemStyle={{ color: 'hsl(var(--card-foreground))' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ScoreRadarChart;