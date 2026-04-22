export default function PlaceholderPage({ title, description }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <p className="kpi-footnote">This screen is connected and ready for implementation.</p>
    </div>
  );
}
