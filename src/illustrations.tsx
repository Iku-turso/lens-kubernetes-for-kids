import type { ReactNode } from "react";
import type { ChapterId } from "./chapters";
import styles from "./illustrations.module.scss";

// Animated picture-book scenes, one per chapter, drawn as inline SVG. Each scene paints its own sky
// and ground, so it reads the same as a framed picture in the light theme and the dark one.

const ink = "#1D3F8C";
const leaf = "#3E8E41";
const pea = "#9BDB7F";
const podGreen = "#6CBF5B";
const roofRed = "#FF6B6B";
const sunny = "#FFD43B";
const snow = "#FFFFFF";
const lunchboxOrange = "#FF8A65";
const kubeBlue = "#326CE5";
const wood = "#C68B59";

const line = { stroke: ink, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// Moves what it wraps with one of the animations in illustrations.module.scss.
const Anim = ({ name, delay = 0, children }: { name: string; delay?: number; children: ReactNode }) => (
  <g className={styles[name]} style={delay ? { animationDelay: `${delay}s` } : undefined}>
    {children}
  </g>
);

const Scene = ({ label, sky = "#BFE3FF", ground = "#8BD17C", children }: { label: string; sky?: string; ground?: string | null; children: ReactNode }) => (
  <svg viewBox="0 0 480 220" role="img" aria-label={label} className={styles.scene}>
    <rect x="0" y="0" width="480" height="220" rx="18" fill={sky} />
    {ground && <path d="M0 178 Q120 166 240 176 T480 172 V202 Q480 220 462 220 H18 Q0 220 0 202 Z" fill={ground} />}
    {children}
  </svg>
);

const Face = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g>
    <Anim name="blink" delay={(Math.round(x) % 9) * 0.45}>
      <circle cx={x - 5 * s} cy={y} r={2.2 * s} fill={ink} />
      <circle cx={x + 5 * s} cy={y} r={2.2 * s} fill={ink} />
    </Anim>
    <path d={`M${x - 4 * s} ${y + 5 * s} Q${x} ${y + 9 * s} ${x + 4 * s} ${y + 5 * s}`} fill="none" {...line} strokeWidth={2 * s} />
  </g>
);

const SleepyFace = ({ x, y }: { x: number; y: number }) => (
  <g fill="none" {...line} strokeWidth={2}>
    <path d={`M${x - 8} ${y} q3 3 6 0`} />
    <path d={`M${x + 2} ${y} q3 3 6 0`} />
    <path d={`M${x - 3} ${y + 7} h6`} />
  </g>
);

const Sun = ({ x, y, r = 18 }: { x: number; y: number; r?: number }) => (
  <g>
    <Anim name="spin">
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;

        return <line key={i} x1={x + Math.cos(a) * (r + 5)} y1={y + Math.sin(a) * (r + 5)} x2={x + Math.cos(a) * (r + 12)} y2={y + Math.sin(a) * (r + 12)} stroke={sunny} strokeWidth="4" strokeLinecap="round" />;
      })}
    </Anim>
    <circle cx={x} cy={y} r={r} fill={sunny} />
    <Face x={x} y={y - 2} s={0.8} />
  </g>
);

const Cloud = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <Anim name="drift" delay={-(x % 7)}>
    <g fill={snow} transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="0" r="12" />
      <circle cx="14" cy="-6" r="15" />
      <circle cx="30" cy="0" r="12" />
      <rect x="0" y="0" width="30" height="12" />
    </g>
  </Anim>
);

const House = ({ x, y, w = 80, h = 60, body = "#FFF6E0", roof = roofRed, door = true, children }: { x: number; y: number; w?: number; h?: number; body?: string; roof?: string; door?: boolean; children?: ReactNode }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={body} {...line} />
    <path d={`M${x - 8} ${y} L${x + w / 2} ${y - h * 0.6} L${x + w + 8} ${y} Z`} fill={roof} {...line} />
    {door && <rect x={x + w / 2 - w * 0.11} y={y + h * 0.55} width={w * 0.22} height={h * 0.45} fill={wood} {...line} />}
    {children}
  </g>
);

const PeaPod = ({ x, y, w = 110, ry = 22, peas = 3, sleepy = false }: { x: number; y: number; w?: number; ry?: number; peas?: number; sleepy?: boolean }) => {
  const gap = w / (peas + 1);
  const peaRadius = Math.min(15, gap / 2 - 1, ry - 4);

  return (
    <g>
      <path d={`M${x - w / 2 - 2} ${y} q-6 -6 -2 -${ry / 2 + 2}`} fill="none" stroke={leaf} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx={x} cy={y} rx={w / 2} ry={ry} fill={podGreen} stroke={leaf} strokeWidth="3" />
      {Array.from({ length: peas }, (_, i) => {
        const px = x - w / 2 + gap * (i + 1);

        return (
          <g key={i}>
            <circle cx={px} cy={y} r={peaRadius} fill={pea} stroke={leaf} strokeWidth="2" />
            {sleepy ? <SleepyFace x={px} y={y - 2} /> : <Face x={px} y={y - peaRadius / 5} s={peaRadius / 21} />}
          </g>
        );
      })}
    </g>
  );
};

const Lunchbox = ({ x, y, w = 90, h = 58, open = false, color = lunchboxOrange, face = true }: { x: number; y: number; w?: number; h?: number; open?: boolean; color?: string; face?: boolean }) => (
  <g>
    {open && <rect x={x} y={y - h * 0.55} width={w} height={h * 0.45} rx="8" fill={color} {...line} transform={`rotate(-14 ${x} ${y})`} />}
    {!open && <path d={`M${x + w * 0.3} ${y} v-12 q0 -8 8 -8 h${w * 0.4 - 16} q8 0 8 8 v12`} fill="none" {...line} />}
    {open && (
      <g>
        <path d={`M${x + 12} ${y + 4} L${x + 40} ${y - 22} L${x + 46} ${y + 4} Z`} fill="#F5D7A1" {...line} strokeWidth={2} />
        <circle cx={x + w - 26} cy={y - 8} r="12" fill={roofRed} {...line} strokeWidth={2} />
        <path d={`M${x + w - 26} ${y - 20} q4 -6 8 -6`} fill="none" stroke={leaf} strokeWidth="3" />
        <rect x={x + 50} y={y - 20} width="14" height="24" rx="3" fill="#7EC8E3" {...line} strokeWidth={2} />
      </g>
    )}
    <rect x={x} y={y} width={w} height={h} rx="10" fill={color} {...line} />
    <rect x={x + w / 2 - 7} y={y - 2} width="14" height="10" rx="3" fill={sunny} {...line} strokeWidth={2} />
    {face && <Face x={x + w / 2} y={y + h * 0.55} />}
  </g>
);

const Snowman = ({ x, y, s = 1, hat = "#333" }: { x: number; y: number; s?: number; hat?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx="0" cy="-22" r="24" fill={snow} {...line} />
    <circle cx="0" cy="-60" r="17" fill={snow} {...line} />
    <circle cx="0" cy="-88" r="12" fill={snow} {...line} />
    <circle cx="-4" cy="-91" r="1.8" fill={ink} />
    <circle cx="4" cy="-91" r="1.8" fill={ink} />
    <path d="M0 -87 l10 2 l-10 2 Z" fill="#FF8C1A" />
    <circle cx="0" cy="-64" r="2" fill={ink} />
    <circle cx="0" cy="-54" r="2" fill={ink} />
    <rect x="-10" y="-112" width="20" height="14" fill={hat} />
    <rect x="-15" y="-100" width="30" height="4" fill={hat} />
  </g>
);

const Helm = ({ x, y, r = 46 }: { x: number; y: number; r?: number }) => (
  <g>
    <Anim name="spin">
      {Array.from({ length: 7 }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7;

        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + Math.cos(a) * (r + 10)} y2={y + Math.sin(a) * (r + 10)} stroke={snow} strokeWidth="6" strokeLinecap="round" />
            <circle cx={x + Math.cos(a) * (r + 12)} cy={y + Math.sin(a) * (r + 12)} r="6" fill={snow} stroke={kubeBlue} strokeWidth="3" />
          </g>
        );
      })}
    </Anim>
    <circle cx={x} cy={y} r={r} fill={kubeBlue} stroke={snow} strokeWidth="5" />
    <circle cx={x - 14} cy={y - 6} r="5" fill={snow} />
    <circle cx={x + 14} cy={y - 6} r="5" fill={snow} />
    <circle cx={x - 13} cy={y - 5} r="2.5" fill={ink} />
    <circle cx={x + 15} cy={y - 5} r="2.5" fill={ink} />
    <path d={`M${x - 14} ${y + 12} Q${x} ${y + 26} ${x + 14} ${y + 12}`} fill="none" stroke={snow} strokeWidth="4" strokeLinecap="round" />
  </g>
);

const Label = ({ x, y, children, size = 15, color = ink }: { x: number; y: number; children: ReactNode; size?: number; color?: string }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif" fontSize={size} fontWeight="700" fill={color}>
    {children}
  </text>
);

const DashedArrow = ({ d }: { d: string }) => <path d={d} fill="none" stroke={ink} strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#jaakko-arrow)" className={styles.march} />;

const ArrowDefs = () => (
  <defs>
    <marker id="jaakko-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 Z" fill={ink} />
    </marker>
  </defs>
);

const Toy = {
  Robot: ({ x, y }: { x: number; y: number }) => (
    <g>
      <line x1={x} y1={y - 26} x2={x} y2={y - 34} {...line} />
      <circle cx={x} cy={y - 36} r="3" fill={roofRed} />
      <rect x={x - 14} y={y - 26} width="28" height="22" rx="4" fill="#B0BEC5" {...line} />
      <Face x={x} y={y - 18} s={0.7} />
      <rect x={x - 11} y={y - 2} width="22" height="20" rx="3" fill="#90A4AE" {...line} />
    </g>
  ),
  Car: ({ x, y }: { x: number; y: number }) => (
    <g>
      <path d={`M${x - 26} ${y} v-12 l10 -12 h24 l10 12 h8 v12 Z`} fill={roofRed} {...line} />
      <circle cx={x - 14} cy={y + 2} r="7" fill="#444" {...line} />
      <circle cx={x + 14} cy={y + 2} r="7" fill="#444" {...line} />
    </g>
  ),
  Note: ({ x, y }: { x: number; y: number }) => (
    <g fill={ink}>
      <ellipse cx={x} cy={y} rx="8" ry="6" />
      <ellipse cx={x + 22} cy={y - 6} rx="8" ry="6" />
      <path d={`M${x + 6} ${y} V${y - 34} L${x + 28} ${y - 40} V${y - 6}`} fill="none" stroke={ink} strokeWidth="4" />
    </g>
  ),
};

const illustrations: Record<ChapterId, (props: { label: string }) => ReactNode> = {
  hello: ({ label }) => (
    <Scene label={label}>
      <Sun x={420} y={44} />
      <Cloud x={40} y={40} />
      <Helm x={240} y={104} />
      <path d="M120 120 Q150 50 180 70" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="4 8" className={styles.march} />
      <path d="M300 70 Q330 50 360 120" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="4 8" className={styles.march} />
      <Anim name="hop"><Toy.Robot x={100} y={156} /></Anim>
      <Anim name="hop" delay={0.7}><Toy.Car x={380} y={170} /></Anim>
      <Anim name="bob" delay={0.3}><Anim name="sway"><Toy.Note x={150} y={60} /></Anim></Anim>
      <Label x={240} y={208}>I'll keep all your toys running!</Label>
    </Scene>
  ),

  container: ({ label }) => (
    <Scene label={label}>
      <ArrowDefs />
      <Cloud x={380} y={30} s={0.8} />
      <Anim name="hop"><Lunchbox x={190} y={110} w={100} h={62} open /></Anim>
      <House x={36} y={116} w={64} h={52} />
      <Label x={68} y={200} size={13}>home</Label>
      <House x={380} y={116} w={64} h={52} body="#FFE6A7" roof={kubeBlue}>
        <rect x={398} y={124} width="28" height="12" fill={snow} {...line} strokeWidth={2} />
      </House>
      <Label x={412} y={200} size={13}>school</Label>
      <DashedArrow d="M180 140 Q140 128 112 140" />
      <DashedArrow d="M300 140 Q340 128 368 140" />
      <Label x={240} y={30}>Same lunch, wherever you go</Label>
    </Scene>
  ),

  pod: ({ label }) => (
    <Scene label={label} sky="#D7F2D0" ground="#A8DD95">
      <Sun x={60} y={44} r={16} />
      <path d="M240 60 q-30 -24 -10 -40" fill="none" stroke={leaf} strokeWidth="4" strokeLinecap="round" />
      <Anim name="sway"><path d="M232 40 q-28 -10 -34 6 q20 10 34 -6" fill={podGreen} stroke={leaf} strokeWidth="2" /></Anim>
      <path d="M112 118 q-10 -10 -4 -22" fill="none" stroke={leaf} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx={240} cy={118} rx={130} ry={46} fill={podGreen} stroke={leaf} strokeWidth="3" />
      <ellipse cx={240} cy={124} rx={112} ry={32} fill="#B5E6A0" />
      <Anim name="wiggle"><Lunchbox x={168} y={106} w={64} h={40} /></Anim>
      <Anim name="wiggle" delay={0.45}><Lunchbox x={248} y={106} w={64} h={40} color="#7EC8E3" /></Anim>
      <Label x={240} y={208}>Best friends share one pod</Label>
    </Scene>
  ),

  node: ({ label }) => (
    <Scene label={label}>
      <Cloud x={60} y={36} />
      <Sun x={420} y={44} r={16} />
      <House x={110} y={92} w={150} h={86} door={false}>
        <rect x={122} y={102} width="58" height="32" fill="#E3F2FD" {...line} strokeWidth={2} />
        <rect x={190} y={102} width="58" height="32" fill="#E3F2FD" {...line} strokeWidth={2} />
        <rect x={122} y={140} width="58" height="32" fill="#E3F2FD" {...line} strokeWidth={2} />
        <rect x={190} y={140} width="58" height="32" fill="#FFFDE7" {...line} strokeWidth={2} />
        <Anim name="bob"><PeaPod x={151} y={118} w={46} ry={12} peas={2} /></Anim>
        <Anim name="bob" delay={0.6}><PeaPod x={219} y={118} w={46} ry={12} peas={2} /></Anim>
        <Anim name="bob" delay={1.2}><PeaPod x={151} y={156} w={46} ry={12} peas={2} /></Anim>
      </House>
      <Anim name="pulse"><Label x={219} y={160} size={11}>free room!</Label></Anim>
      <g>
        <ellipse cx={340} cy={176} rx={40} ry={8} fill="#6FAE5E" />
        <Anim name="hop"><PeaPod x={340} y={150} w={60} peas={2} /></Anim>
        <path d="M372 112 q12 -10 22 -6" fill="none" {...line} strokeWidth={2} />
        <Label x={410} y={100} size={12}>where do I live?</Label>
      </g>
      <Label x={240} y={208}>A node is a house for pods</Label>
    </Scene>
  ),

  cluster: ({ label }) => (
    <Scene label={label}>
      <Sun x={440} y={36} r={14} />
      <Cloud x={30} y={30} s={0.8} />
      <path d="M0 190 Q240 176 480 190" fill="none" stroke="#9E9E9E" strokeWidth="14" />
      <path d="M0 190 Q240 176 480 190" fill="none" stroke={snow} strokeWidth="2" strokeDasharray="12 12" />
      <House x={30} y={128} w={56} h={44} />
      <House x={110} y={120} w={60} h={50} roof="#FFA94D" />
      <g>
        <path d="M196 92 L240 58 L284 92 Z" fill="#E0E0E0" {...line} />
        <rect x={200} y={92} width="80" height="78" fill="#F5F5F5" {...line} />
        {[210, 230, 250, 270].map((cx) => <rect key={cx} x={cx - 3} y={100} width="6" height="56" fill="#E0E0E0" {...line} strokeWidth={2} />)}
        <rect x={196} y={156} width="88" height="14" fill="#E0E0E0" {...line} />
        <g transform="translate(240 76) scale(0.2)"><Helm x={0} y={0} /></g>
        <Label x={240} y={50} size={12}>town hall</Label>
      </g>
      <House x={310} y={120} w={60} h={50} roof="#74C0FC" />
      <House x={394} y={128} w={56} h={44} roof="#B197FC" />
      <Anim name="drive">
        <Anim name="bob"><g transform="translate(0 186) scale(0.6)"><Toy.Car x={0} y={0} /></g></Anim>
      </Anim>
      <Label x={240} y={212} size={14}>A cluster is a whole town</Label>
    </Scene>
  ),

  "your-towns": ({ label }) => (
    <Scene label={label} sky="#FFF3D6" ground={null}>
      <rect x="40" y="22" width="400" height="176" rx="6" fill="#F7E1B5" stroke={wood} strokeWidth="4" />
      <path d="M80 160 C140 90 200 190 250 120 S360 70 400 80" fill="none" stroke={roofRed} strokeWidth="3" strokeDasharray="8 8" className={styles.march} />
      <Anim name="pulse"><g transform="translate(64 150) scale(0.5)"><House x={0} y={0} w={50} h={40} /></g></Anim>
      <Anim name="pulse" delay={0.6}><g transform="translate(236 104) scale(0.5)"><House x={0} y={0} w={50} h={40} roof="#74C0FC" /></g></Anim>
      <Anim name="pulse" delay={1.2}><g transform="translate(388 64) scale(0.5)"><House x={0} y={0} w={50} h={40} roof="#B197FC" /></g></Anim>
      <g transform="translate(150 60)">
        <circle cx="0" cy="0" r="20" fill="none" {...line} />
        <Anim name="wobble"><path d="M0 -16 L5 0 L0 16 L-5 0 Z" fill={roofRed} /></Anim>
        <Label x={0} y={-24} size={11}>N</Label>
      </g>
      <Label x={330} y={180}>Your towns are waiting!</Label>
    </Scene>
  ),

  "control-plane": ({ label }) => (
    <Scene label={label}>
      <path d="M140 70 L240 24 L340 70 Z" fill="#E0E0E0" {...line} />
      <rect x={150} y={70} width="180" height="100" fill="#F5F5F5" {...line} />
      <rect x={140} y={164} width="200" height="12" fill="#E0E0E0" {...line} />
      <g transform="translate(240 50) scale(0.22)"><Helm x={0} y={0} /></g>
      {[
        { cx: 60, color: "#FFE066", label: "Big Notebook", icon: <><rect x="-12" y="-14" width="24" height="28" rx="2" fill={snow} {...line} strokeWidth={2} /><path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" {...line} strokeWidth={2} /></> },
        { cx: 190, color: "#FFA8A8", label: "Front Desk", icon: <><path d="M-12 8 h24 M-9 8 a9 9 0 0 1 18 0" fill={sunny} {...line} strokeWidth={2} /><circle cx="0" cy="-3" r="2" fill={ink} /></> },
        { cx: 290, color: "#B2F2BB", label: "Room Finder", icon: <><path d="M-13 0 L0 -12 L13 0 V12 H-13 Z" fill={snow} {...line} strokeWidth={2} /><rect x="-4" y="3" width="8" height="9" fill={wood} /></> },
        { cx: 420, color: "#A5D8FF", label: "Checkers", icon: <><circle cx="-2" cy="-2" r="8" fill={snow} {...line} strokeWidth={2} /><path d="M4 4 l8 8" {...line} /></> },
      ].map(({ cx, color, label: name, icon }, index) => (
        <g key={name}>
          <Anim name="hop" delay={index * 0.35}>
            <circle cx={cx} cy={130} r="26" fill={color} {...line} />
            <g transform={`translate(${cx} 128)`}>{icon}</g>
          </Anim>
          <Label x={cx} y={202} size={12}>{name}</Label>
        </g>
      ))}
    </Scene>
  ),

  deployment: ({ label }) => (
    <Scene label={label} sky="#DCEBFF" ground="#F1F7FF">
      <Sun x={430} y={40} r={18} />
      <Anim name="sway"><Snowman x={80} y={186} s={0.9} /></Anim>
      <Anim name="sway" delay={1.1}><Snowman x={170} y={186} s={0.9} hat={roofRed} /></Anim>
      <Anim name="whileMelted">
        <ellipse cx={262} cy={184} rx={34} ry={7} fill="#B3DAFF" />
        <circle cx={262} cy={174} r="10" fill={snow} {...line} />
        <SleepyFace x={262} y={172} />
        <Label x={262} y={140} size={13}>melted!</Label>
      </Anim>
      <Anim name="melt"><Snowman x={262} y={186} s={0.9} hat={kubeBlue} /></Anim>
      <Anim name="whileRebuilt">
        <Label x={262} y={64} size={13}>built again!</Label>
      </Anim>
      <g transform="translate(362 70)">
        <rect x="0" y="0" width="70" height="88" rx="6" fill={wood} {...line} />
        <rect x="8" y="12" width="54" height="68" fill={snow} {...line} strokeWidth={2} />
        <rect x="24" y="-6" width="22" height="12" rx="3" fill="#9E9E9E" {...line} strokeWidth={2} />
        <Label x={35} y={40} size={22}>3</Label>
        <Label x={35} y={56} size={11}>snowmen</Label>
        <Label x={35} y={72} size={11}>always!</Label>
      </g>
    </Scene>
  ),

  service: ({ label }) => (
    <Scene label={label}>
      <ArrowDefs />
      <Anim name="ring">
        <g transform="translate(60 70)">
          <rect x="0" y="0" width="70" height="110" rx="12" fill={ink} />
          <rect x="8" y="12" width="54" height="78" rx="4" fill="#E3F2FD" />
          <circle cx="35" cy="100" r="5" fill={snow} />
          <Face x={35} y={46} />
        </g>
      </Anim>
      <g>
        <rect x={150} y={36} width="150" height="40" rx="20" fill={snow} {...line} />
        <Label x={225} y={62} size={16}>555-PODS</Label>
      </g>
      <DashedArrow d="M140 130 Q240 90 330 72" />
      <DashedArrow d="M140 134 Q240 130 330 128" />
      <DashedArrow d="M140 138 Q240 170 330 180" />
      <Anim name="pulse"><PeaPod x={380} y={72} w={70} peas={2} /></Anim>
      <Anim name="pulse" delay={0.9}><PeaPod x={380} y={128} w={70} peas={2} /></Anim>
      <PeaPod x={380} y={182} w={70} peas={2} sleepy />
      <Label x={240} y={210} size={13}>One number, any free pod answers</Label>
    </Scene>
  ),

  ingress: ({ label }) => (
    <Scene label={label}>
      <Cloud x={380} y={30} />
      <rect x={140} y={60} width="22" height="118" fill="#BDBDBD" {...line} />
      <rect x={318} y={60} width="22" height="118" fill="#BDBDBD" {...line} />
      <path d="M130 60 Q240 10 350 60" fill="none" stroke="#9E9E9E" strokeWidth="18" />
      <path d="M130 60 Q240 10 350 60" fill="none" {...line} />
      <line x1={210} y1={36} x2={210} y2={56} {...line} strokeWidth={2} />
      <line x1={270} y1={36} x2={270} y2={56} {...line} strokeWidth={2} />
      <rect x={190} y={54} width="100" height="24" rx="5" fill={wood} {...line} strokeWidth={2} />
      <Label x={240} y={71} size={13} color={snow}>TOWN GATE</Label>
      <g>
        <circle cx={204} cy={120} r="16" fill="#FFD8A8" {...line} className={styles.bob} />
        <Face x={204} y={118} s={0.8} />
        <rect x={190} y={102} width="28" height="8" fill={kubeBlue} />
        <rect x={190} y={136} width="28" height="40" rx="6" fill={kubeBlue} {...line} />
      </g>
      <g>
        <rect x={268} y={100} width="4" height="76" fill={wood} />
        <Anim name="wiggle">
          <path d="M272 106 h36 l8 8 l-8 8 h-36 Z" fill={sunny} {...line} strokeWidth={2} />
          <Label x={292} y={119} size={10}>shop</Label>
        </Anim>
        <Anim name="wiggle" delay={0.45}>
          <path d="M268 134 h-34 l-8 8 l8 8 h34 Z" fill="#A5D8FF" {...line} strokeWidth={2} />
          <Label x={249} y={147} size={10}>library</Label>
        </Anim>
      </g>
      {[40, 80].map((cx, i) => (
        <Anim key={cx} name="walk" delay={i * -3.5}>
          <Anim name="hop" delay={i * 0.3}>
            <circle cx={cx - 40} cy={142} r="12" fill={i ? "#FFC9C9" : "#D0BFFF"} {...line} />
            <Face x={cx - 40} y={140} s={0.6} />
            <rect x={cx - 50} y={154} width="20" height="24" rx="5" fill={i ? roofRed : "#845EF7"} {...line} />
          </Anim>
        </Anim>
      ))}
      <Label x={240} y={208} size={13}>Visitors from outside come in here</Label>
    </Scene>
  ),

  namespace: ({ label }) => {
    const Teddy = ({ x, y }: { x: number; y: number }) => (
      <g fill={wood} {...line} strokeWidth={2}>
        <circle cx={x - 10} cy={y - 26} r="6" />
        <circle cx={x + 10} cy={y - 26} r="6" />
        <circle cx={x} cy={y - 16} r="13" />
        <ellipse cx={x} cy={y + 6} rx="15" ry="14" />
        <Face x={x} y={y - 18} s={0.6} />
      </g>
    );

    return (
      <Scene label={label}>
        <path d="M80 70 L240 20 L400 70 Z" fill={roofRed} {...line} />
        <rect x={90} y={70} width="300" height="110" fill="#FFF6E0" {...line} />
        <line x1={240} y1={70} x2={240} y2={180} {...line} />
        <rect x={110} y={82} width="110" height="26" rx="6" fill={sunny} {...line} strokeWidth={2} />
        <Label x={165} y={100} size={13}>team-red</Label>
        <rect x={260} y={82} width="110" height="26" rx="6" fill="#A5D8FF" {...line} strokeWidth={2} />
        <Label x={315} y={100} size={13}>team-blue</Label>
        <Anim name="sway"><Teddy x={165} y={156} /></Anim>
        <Anim name="sway" delay={1.5}><Teddy x={315} y={156} /></Anim>
        <Label x={240} y={208} size={13}>Two "Teddy"s, two rooms, no mix-ups</Label>
      </Scene>
    );
  },

  config: ({ label }) => (
    <Scene label={label} sky="#FDEBD3" ground="#E9C8A0">
      <g>
        <rect x={60} y={20} width="130" height="170" rx="10" fill="#E9ECEF" {...line} />
        <line x1={60} y1={80} x2={190} y2={80} {...line} />
        <rect x={172} y={40} width="6" height="26" rx="3" fill="#ADB5BD" />
        <rect x={172} y={96} width="6" height="40" rx="3" fill="#ADB5BD" />
        <Anim name="flutter">
          <rect x={84} y={92} width="84" height="70" fill={snow} {...line} strokeWidth={2} />
          <circle cx={126} cy={92} r="6" fill={roofRed} />
          <Label x={126} y={114} size={11}>Recipe</Label>
          <path d="M94 126 h60 M94 138 h48 M94 150 h54" {...line} strokeWidth={2} />
        </Anim>
      </g>
      <g>
        <rect x={290} y={70} width="110" height="110" rx="8" fill="#B197FC" {...line} />
        <rect x={290} y={70} width="16" height="110" fill="#9775FA" {...line} />
        <Label x={350} y={110} size={13}>Secret</Label>
        <Anim name="ring">
          <path d="M384 126 v-12 a10 10 0 0 1 20 0 v12" fill="none" stroke="#868E96" strokeWidth="5" />
          <rect x={378} y={124} width="32" height="28" rx="4" fill={sunny} {...line} />
          <circle cx={394} cy={136} r="3" fill={ink} />
          <path d="M394 138 v6" {...line} strokeWidth={2} />
        </Anim>
      </g>
      <Label x={240} y={210} size={13}>Anyone reads the card. Only some may open the diary.</Label>
    </Scene>
  ),

  volume: ({ label }) => (
    <Scene label={label}>
      <g>
        <Anim name="wiggle"><Lunchbox x={70} y={112} w={100} h={60} /></Anim>
        {[[80, 100, 8], [100, 84, 11], [140, 92, 7], [160, 76, 9], [120, 104, 6]].map(([cx, cy, r], index) => (
          <Anim key={`${cx}-${cy}`} name="rise" delay={index * 0.55}>
            <circle cx={cx} cy={cy} r={r} fill="#E7F5FF" stroke="#74C0FC" strokeWidth="2" />
          </Anim>
        ))}
        <Label x={120} y={198} size={13}>washed out!</Label>
      </g>
      <Anim name="hop">
        <path d="M300 80 q50 -50 100 0" fill="none" stroke="#C92A2A" strokeWidth="8" />
        <rect x={290} y={74} width="120" height="104" rx="22" fill="#FF6B6B" {...line} />
        <rect x={310} y={120} width="80" height="44" rx="10" fill="#FA5252" {...line} />
        <path d="M330 94 l5 10 l11 1 l-8 7 l3 11 l-11 -6 l-11 6 l3 -11 l-8 -7 l11 -1 Z" fill={sunny} {...line} strokeWidth={1.5} />
        <circle cx={372} cy={100} r="9" fill="#74C0FC" {...line} strokeWidth={2} />
        <Face x={350} y={138} />
      </Anim>
      <Label x={350} y={198} size={13}>stays safe</Label>
    </Scene>
  ),

  lens: ({ label }) => (
    <Scene label={label} sky="#E5DBFF" ground="#C5B3F7">
      <g>
        <circle cx={330} cy={104} r="76" fill="#BFE3FF" {...line} />
        <clipPath id="jaakko-lens-view"><circle cx={330} cy={104} r="74" /></clipPath>
        <g clipPath="url(#jaakko-lens-view)">
          <rect x={250} y={150} width="160" height="40" fill="#8BD17C" />
          <House x={276} y={118} w={40} h={34} />
          <House x={340} y={110} w={46} h={42} roof="#74C0FC" />
          <Anim name="hop"><PeaPod x={300} y={158} w={44} ry={12} peas={2} /></Anim>
        </g>
      </g>
      <Anim name="lookAround">
      <g transform="translate(80 70)">
        <rect x="30" y="20" width="28" height="30" rx="4" fill="#495057" {...line} />
        <circle cx="20" cy="56" r="28" fill="#343A40" {...line} />
        <circle cx="70" cy="56" r="28" fill="#343A40" {...line} />
        <circle cx="20" cy="56" r="17" fill="#A5D8FF" />
        <circle cx="70" cy="56" r="17" fill="#A5D8FF" />
        <circle cx="14" cy="50" r="5" fill={snow} />
        <circle cx="64" cy="50" r="5" fill={snow} />
      </g>
      </Anim>
      <path d="M180 120 L256 80 M180 136 L256 150" stroke={ink} strokeWidth="2" strokeDasharray="4 8" className={styles.march} />
      <Label x={130} y={200} size={13}>Lens lets you peek in</Label>
    </Scene>
  ),

  quiz: ({ label }) => (
    <Scene label={label} sky="#FFF0F6" ground="#FFD6E7">
      {[[60, 40, roofRed], [110, 20, kubeBlue], [400, 50, sunny], [430, 10, leaf], [80, 30, "#845EF7"], [380, 20, roofRed], [160, 30, leaf], [330, 30, "#845EF7"], [200, 10, sunny], [290, 16, kubeBlue]].map(([x, y, c], index) => (
        <Anim key={`${x}-${y}`} name="fall" delay={(index * 0.47) % 4}>
          <rect x={x as number} y={y as number} width="10" height="6" fill={c as string} />
        </Anim>
      ))}
      <Anim name="twinkle">
        <path d="M240 26 l20 42 l46 6 l-34 32 l9 46 l-41 -22 l-41 22 l9 -46 l-34 -32 l46 -6 Z" fill={sunny} {...line} />
        <Face x={240} y={94} s={1.4} />
      </Anim>
      <Anim name="hop" delay={0.4}>
      <g transform="translate(320 120)">
        <path d="M10 0 h50 v20 a25 25 0 0 1 -50 0 Z" fill="#FCC419" {...line} />
        <path d="M10 6 h-10 a10 10 0 0 0 10 16 M60 6 h10 a10 10 0 0 1 -10 16" fill="none" {...line} />
        <rect x="30" y="44" width="10" height="12" fill="#FCC419" {...line} />
        <rect x="20" y="56" width="30" height="8" fill={wood} {...line} />
      </g>
      </Anim>
      <Label x={240} y={206}>You can do it!</Label>
    </Scene>
  ),
};

export const ChapterIllustration = ({ chapterId, label }: { chapterId: ChapterId; label: string }) => {
  const Illustration = illustrations[chapterId];

  return <Illustration label={label} />;
};
