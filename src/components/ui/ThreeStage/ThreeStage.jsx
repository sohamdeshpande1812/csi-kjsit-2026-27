import styles from './ThreeStage.module.css';

export function StageSchematicFallback({ id = 'fallback', label = 'Initializing 3D Viewport…' }) {
  return (
    <div className={styles.fallbackWrap} aria-hidden="true">
      <div className={styles.schematic}>
        <svg className={styles.reticle} viewBox="0 0 360 360">
          <defs>
            <linearGradient id={`stage-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eef2f7" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#2f7bff" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#5ce1ff" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <circle
            cx="180"
            cy="180"
            r="148"
            fill="none"
            stroke="rgba(183, 194, 211, 0.14)"
            strokeWidth="1"
          />
          <circle
            cx="180"
            cy="180"
            r="132"
            fill="none"
            stroke={`url(#stage-grad-${id})`}
            strokeWidth="1.25"
            strokeDasharray="10 6 2 6"
          />
          <polygon
            points="180,58 286,119 286,241 180,302 74,241 74,119"
            fill="rgba(47, 123, 255, 0.04)"
            stroke="rgba(47, 123, 255, 0.42)"
            strokeWidth="1.25"
          />
          <polygon
            points="180,92 256,136 256,224 180,268 104,224 104,136"
            fill="none"
            stroke="rgba(183, 194, 211, 0.25)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line x1="180" y1="20" x2="180" y2="70" stroke="rgba(92, 225, 255, 0.35)" strokeWidth="1" />
          <line x1="180" y1="290" x2="180" y2="340" stroke="rgba(92, 225, 255, 0.35)" strokeWidth="1" />
          <line x1="20" y1="180" x2="70" y2="180" stroke="rgba(92, 225, 255, 0.35)" strokeWidth="1" />
          <line x1="290" y1="180" x2="340" y2="180" stroke="rgba(92, 225, 255, 0.35)" strokeWidth="1" />
          <polygon
            points="180,134 220,157 220,203 180,226 140,203 140,157"
            fill="rgba(47, 123, 255, 0.14)"
            stroke="#2f7bff"
            strokeWidth="1.5"
          />
          <circle cx="180" cy="180" r="6" fill="#5ce1ff" />
        </svg>
      </div>
      {label && <p className={styles.fallbackLabel}>{label}</p>}
    </div>
  );
}

/**
 * 3D viewport container for Three.js / React Three Fiber scenes.
 * Supports live R3F scene children as well as a schematic fallback when
 * no scene is mounted yet or if WebGL is unavailable.
 */
export default function ThreeStage({
  id,
  variant = 'hero',
  tag,
  statusLabel = '3D Stage Ready',
  title,
  subtitle,
  specs = [],
  children,
}) {
  const hasScene = Boolean(children);

  return (
    <div
      id={id}
      data-three-stage={variant}
      className={`${styles.stage} ${styles[variant]} chamfer`}
      role="region"
      aria-label={title}
    >
      {/* Corner alignment brackets */}
      <span className={`${styles.corner} ${styles.topLeft}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.topRight}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.bottomLeft}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.bottomRight}`} aria-hidden="true" />

      {/* Top HUD bar */}
      <div className={styles.hudTop}>
        <span className="hud-label">{tag}</span>
        <span className={styles.statusPill}>
          <span className={styles.statusDot} aria-hidden="true" />
          {statusLabel}
        </span>
      </div>

      {/* Central 3D viewport or schematic fallback */}
      <div className={`${styles.viewport} ${hasScene ? styles.viewportScene : ''}`}>
        {hasScene ? (
          <div className={styles.canvasHost}>{children}</div>
        ) : (
          <>
            <StageSchematicFallback id={id} label="" />
            <div className={styles.caption}>
              <p className={styles.stageTitle}>{title}</p>
              <p className={styles.stageSubtitle}>{subtitle}</p>
            </div>
          </>
        )}
      </div>

      {/* Bottom telemetry bar */}
      {specs.length > 0 && (
        <dl className={styles.specs}>
          {specs.map((spec) => (
            <div key={spec.label} className={styles.specItem}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
