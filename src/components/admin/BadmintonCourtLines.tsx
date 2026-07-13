import { cn } from "@/lib/utils";

/**
 * BWF doubles court proportions (horizontal umpire view).
 * Length 13.40 m × width 6.10 m — viewBox in decimetres.
 */
const COURT_LENGTH = 134;
const COURT_WIDTH = 61;
const HALF_LENGTH = 67;
const SHORT_SERVICE = 19.8; // 1.98 m from net
const LONG_SERVICE = 7.6; // 0.76 m from back boundary (doubles)
const SINGLES_INSET = 4.6; // 0.46 m from doubles sideline
const MID_WIDTH = COURT_WIDTH / 2;

const LEFT_SHORT = HALF_LENGTH - SHORT_SERVICE;
const RIGHT_SHORT = HALF_LENGTH + SHORT_SERVICE;
const LEFT_LONG = LONG_SERVICE;
const RIGHT_LONG = COURT_LENGTH - LONG_SERVICE;
const SINGLES_TOP = SINGLES_INSET;
const SINGLES_BOTTOM = COURT_WIDTH - SINGLES_INSET;

interface BadmintonCourtLinesProps {
    isSingles?: boolean;
    className?: string;
}

export function BadmintonCourtLines({ isSingles = false, className }: BadmintonCourtLinesProps) {
    const line = "stroke-white";
    const boundary = `${line} stroke-[0.35] opacity-70`;
    const service = `${line} stroke-[0.3] opacity-55`;
    const singles = `${line} stroke-[0.25] opacity-45`;
    const net = `${line} stroke-[0.55] opacity-90`;

    return (
        <svg
            viewBox={`0 0 ${COURT_LENGTH} ${COURT_WIDTH}`}
            preserveAspectRatio="none"
            className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
            aria-hidden
        >
            <rect
                x={0.25}
                y={0.25}
                width={COURT_LENGTH - 0.5}
                height={COURT_WIDTH - 0.5}
                fill="none"
                className={boundary}
            />

            {/* Net */}
            <line x1={HALF_LENGTH} y1={0} x2={HALF_LENGTH} y2={COURT_WIDTH} className={net} />

            {/* Short service lines */}
            <line x1={LEFT_SHORT} y1={0} x2={LEFT_SHORT} y2={COURT_WIDTH} className={service} />
            <line x1={RIGHT_SHORT} y1={0} x2={RIGHT_SHORT} y2={COURT_WIDTH} className={service} />

            {/* Long service lines (doubles back service line) */}
            {!isSingles && (
                <>
                    <line x1={LEFT_LONG} y1={0} x2={LEFT_LONG} y2={COURT_WIDTH} className={service} />
                    <line x1={RIGHT_LONG} y1={0} x2={RIGHT_LONG} y2={COURT_WIDTH} className={service} />
                </>
            )}

            {/* Centre lines (short service → long service / back boundary) */}
            <line
                x1={isSingles ? 0 : LEFT_LONG}
                y1={MID_WIDTH}
                x2={LEFT_SHORT}
                y2={MID_WIDTH}
                className={service}
            />
            <line
                x1={RIGHT_SHORT}
                y1={MID_WIDTH}
                x2={isSingles ? COURT_LENGTH : RIGHT_LONG}
                y2={MID_WIDTH}
                className={service}
            />

            {/* Singles sidelines */}
            <line
                x1={0}
                y1={SINGLES_TOP}
                x2={COURT_LENGTH}
                y2={SINGLES_TOP}
                className={isSingles ? service : singles}
            />
            <line
                x1={0}
                y1={SINGLES_BOTTOM}
                x2={COURT_LENGTH}
                y2={SINGLES_BOTTOM}
                className={isSingles ? service : singles}
            />
        </svg>
    );
}
