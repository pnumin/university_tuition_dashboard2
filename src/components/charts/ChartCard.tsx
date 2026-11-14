import type { PropsWithChildren, ReactNode } from 'react';

interface ChartCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  action?: ReactNode;
  tall?: boolean;
}

export function ChartCard({ title, description, action, tall, children }: ChartCardProps) {
  return (
    <article className={`card chart-card ${tall ? 'tall' : ''}`}>
      <div className="card-heading">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      <div className="chart-body">{children}</div>
    </article>
  );
}
