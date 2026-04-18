import { useMemo } from 'react';
import { TREE_TYPES, getTreeTypeForPomodoros, getNextTreeType } from '../utils/achievements';

function TreeSVG({ type, stage, isAnimating }) {
  const stagePercent = stage === 'seed' ? 0 : stage === 'sprout' ? 33 : stage === 'sapling' ? 66 : 100;
  const scale = 0.3 + (stagePercent / 100) * 0.7;

  const treeColor = TREE_TYPES[type]?.color || '#4CAF50';
  const trunkColor = '#795548';
  const potColor = '#8D6E63';

  if (type === 'bonsai') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <g transform={`scale(${scale}) translate(${50 - 50 * scale}, ${100 - 100 * scale})`}>
          {stage === 'seed' && (
            <ellipse cx="50" cy="85" rx="15" ry="5" fill="#8D6E63" />
          )}
          {stage === 'sprout' && (
            <>
              <ellipse cx="50" cy="88" rx="12" ry="4" fill={potColor} />
              <rect x="46" y="80" width="8" height="8" fill={trunkColor} />
              <ellipse cx="50" cy="78" rx="6" ry="4" fill={treeColor} />
            </>
          )}
          {stage === 'sapling' && (
            <>
              <ellipse cx="50" cy="92" rx="15" ry="5" fill={potColor} />
              <rect x="45" y="75" width="10" height="17" fill={trunkColor} />
              <ellipse cx="50" cy="68" rx="20" ry="15" fill={treeColor} />
            </>
          )}
          {stage === 'mature' && (
            <>
              <ellipse cx="50" cy="95" rx="18" ry="6" fill={potColor} />
              <path d="M40 95 Q50 85 60 95" fill={trunkColor} />
              <rect x="46" y="60" width="8" height="35" fill={trunkColor} />
              <ellipse cx="50" cy="45" rx="30" ry="25" fill={treeColor} />
              <ellipse cx="35" cy="55" rx="12" ry="10" fill={treeColor} opacity="0.8" />
              <ellipse cx="65" cy="55" rx="12" ry="10" fill={treeColor} opacity="0.8" />
            </>
          )}
        </g>
      </svg>
    );
  }

  if (type === 'pine') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <g transform={`scale(${scale}) translate(${50 - 50 * scale}, ${100 - 100 * scale})`}>
          {stage === 'seed' && (
            <ellipse cx="50" cy="85" rx="8" ry="3" fill="#2E7D32" />
          )}
          {stage === 'sprout' && (
            <>
              <rect x="48" y="75" width="4" height="10" fill={trunkColor} />
              <polygon points="50,65 44,75 56,75" fill={treeColor} />
            </>
          )}
          {stage === 'sapling' && (
            <>
              <rect x="47" y="70" width="6" height="20" fill={trunkColor} />
              <polygon points="50,45 40,70 60,70" fill={treeColor} />
              <polygon points="50,55 42,70 58,70" fill={treeColor} opacity="0.9" />
            </>
          )}
          {stage === 'mature' && (
            <>
              <rect x="46" y="65" width="8" height="30" fill={trunkColor} />
              <polygon points="50,10 35,45 65,45" fill={treeColor} />
              <polygon points="50,25 38,50 62,50" fill={treeColor} opacity="0.9" />
              <polygon points="50,40 40,60 60,60" fill={treeColor} opacity="0.8" />
              <polygon points="50,55 42,70 58,70" fill={treeColor} opacity="0.7" />
            </>
          )}
        </g>
      </svg>
    );
  }

  if (type === 'cherry') {
    const blossomColor = '#E91E63';
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <g transform={`scale(${scale}) translate(${50 - 50 * scale}, ${100 - 100 * scale})`}>
          {stage === 'seed' && (
            <ellipse cx="50" cy="85" rx="8" ry="3" fill="#F8BBD9" />
          )}
          {stage === 'sprout' && (
            <>
              <rect x="48" y="75" width="4" height="10" fill={trunkColor} />
              <circle cx="50" cy="72" r="5" fill="#C8E6C9" />
            </>
          )}
          {stage === 'sapling' && (
            <>
              <rect x="47" y="65" width="6" height="25" fill={trunkColor} />
              <circle cx="50" cy="55" r="18" fill="#C8E6C9" />
            </>
          )}
          {stage === 'mature' && (
            <>
              <path d="M45 90 Q50 70 55 90" fill={trunkColor} />
              <rect x="47" y="50" width="6" height="40" fill={trunkColor} />
              <circle cx="50" cy="40" r="25" fill="#F8BBD9" />
              <circle cx="35" cy="50" r="12" fill={blossomColor} opacity="0.7" />
              <circle cx="65" cy="50" r="12" fill={blossomColor} opacity="0.7" />
              <circle cx="50" cy="30" r="10" fill={blossomColor} opacity="0.8" />
              <circle cx="38" cy="38" r="8" fill={blossomColor} opacity="0.6" />
              <circle cx="62" cy="38" r="8" fill={blossomColor} opacity="0.6" />
            </>
          )}
        </g>
      </svg>
    );
  }

  if (type === 'maple') {
    const leafColor = '#FF5722';
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <g transform={`scale(${scale}) translate(${50 - 50 * scale}, ${100 - 100 * scale})`}>
          {stage === 'seed' && (
            <ellipse cx="50" cy="85" rx="8" ry="3" fill="#FFCCBC" />
          )}
          {stage === 'sprout' && (
            <>
              <rect x="48" y="75" width="4" height="10" fill={trunkColor} />
              <ellipse cx="50" cy="72" rx="6" ry="4" fill="#81C784" />
            </>
          )}
          {stage === 'sapling' && (
            <>
              <rect x="47" y="65" width="6" height="25" fill={trunkColor} />
              <ellipse cx="50" cy="50" rx="18" ry="20" fill="#81C784" />
            </>
          )}
          {stage === 'mature' && (
            <>
              <rect x="46" y="60" width="8" height="35" fill={trunkColor} />
              <ellipse cx="50" cy="40" rx="30" ry="28" fill={leafColor} />
              <ellipse cx="35" cy="50" rx="15" ry="12" fill={leafColor} opacity="0.9" />
              <ellipse cx="65" cy="50" rx="15" ry="12" fill={leafColor} opacity="0.9" />
              <ellipse cx="50" cy="25" rx="18" ry="15" fill={leafColor} opacity="0.8" />
              <circle cx="30" cy="35" r="4" fill="#BF360C" opacity="0.5" />
              <circle cx="70" cy="35" r="4" fill="#BF360C" opacity="0.5" />
              <circle cx="50" cy="20" r="3" fill="#BF360C" opacity="0.5" />
            </>
          )}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g transform={`scale(${scale}) translate(${50 - 50 * scale}, ${100 - 100 * scale})`}>
        {stage === 'seed' && (
          <ellipse cx="50" cy="85" rx="10" ry="4" fill="#A5D6A7" />
        )}
        {stage === 'sprout' && (
          <>
            <rect x="48" y="75" width="4" height="10" fill={trunkColor} />
            <ellipse cx="50" cy="72" rx="8" ry="6" fill={treeColor} />
          </>
        )}
        {stage === 'sapling' && (
          <>
            <rect x="46" y="60" width="8" height="30" fill={trunkColor} />
            <ellipse cx="50" cy="45" rx="25" ry="25" fill={treeColor} />
          </>
        )}
        {stage === 'mature' && (
          <>
            <rect x="44" y="55" width="12" height="40" fill={trunkColor} />
            <ellipse cx="50" cy="35" rx="40" ry="35" fill={treeColor} />
            <ellipse cx="30" cy="50" rx="15" ry="12" fill={treeColor} opacity="0.9" />
            <ellipse cx="70" cy="50" rx="15" ry="12" fill={treeColor} opacity="0.9" />
            <ellipse cx="50" cy="20" rx="25" ry="20" fill={treeColor} opacity="0.8" />
            <circle cx="35" cy="30" r="5" fill="#2E7D32" opacity="0.3" />
            <circle cx="65" cy="35" r="4" fill="#2E7D32" opacity="0.3" />
            <circle cx="50" cy="15" r="3" fill="#2E7D32" opacity="0.3" />
          </>
        )}
      </g>
    </svg>
  );
}

function getGrowthStage(progress) {
  if (progress < 25) return 'seed';
  if (progress < 50) return 'sprout';
  if (progress < 75) return 'sapling';
  return 'mature';
}

export default function TreeVisual({ totalPomodoros, plantedTrees }) {
  const currentTreeType = useMemo(
    () => getTreeTypeForPomodoros(totalPomodoros),
    [totalPomodoros]
  );

  const nextTreeType = useMemo(
    () => getNextTreeType(totalPomodoros),
    [totalPomodoros]
  );

  const currentTree = plantedTrees[plantedTrees.length - 1];
  const progress = currentTree ? (currentTree.growth || 0) : 0;
  const stage = getGrowthStage(progress);

  const pomodorosToNext = nextTreeType
    ? nextTreeType[1].unlockAt - totalPomodoros
    : 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-32 h-32 transition-transform duration-500 will-change-transform"
        style={{ transform: progress > 0 ? 'scale(1.02)' : 'scale(1)' }}
      >
        <TreeSVG type={currentTreeType} stage={stage} />
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
          {TREE_TYPES[currentTreeType]?.name}
        </p>
        {nextTreeType && (
          <p className="text-xs text-[#5C6B60] dark:text-[#9CA89F]">
            {pomodorosToNext} to next tree
          </p>
        )}
      </div>
      <div className="mt-1 flex items-center gap-1">
        <span className="text-xs text-[#5C6B60] dark:text-[#9CA89F]">
          {plantedTrees.length} trees planted
        </span>
      </div>
    </div>
  );
}
