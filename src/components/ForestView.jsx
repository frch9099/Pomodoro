import { useMemo } from 'react';
import { getTreeTypeForPomodoros } from '../utils/achievements';

function MiniTree({ type }) {
  const treeColor = {
    oak: '#4CAF50',
    pine: '#2E7D32',
    cherry: '#E91E63',
    maple: '#FF5722',
    bonsai: '#795548',
  }[type] || '#4CAF50';

  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {type === 'pine' && (
          <>
            <rect x="46" y="70" width="8" height="25" fill="#795548" />
            <polygon points="50,20 35,50 65,50" fill={treeColor} />
            <polygon points="50,35 38,55 62,55" fill={treeColor} opacity="0.9" />
            <polygon points="50,50 40,65 60,65" fill={treeColor} opacity="0.8" />
          </>
        )}
        {type === 'cherry' && (
          <>
            <rect x="47" y="60" width="6" height="35" fill="#795548" />
            <circle cx="50" cy="45" r="25" fill="#F8BBD9" />
            <circle cx="35" cy="50" r="10" fill="#E91E63" opacity="0.7" />
            <circle cx="65" cy="50" r="10" fill="#E91E63" opacity="0.7" />
          </>
        )}
        {type === 'maple' && (
          <>
            <rect x="46" y="60" width="8" height="35" fill="#795548" />
            <ellipse cx="50" cy="40" rx="30" ry="28" fill={treeColor} />
          </>
        )}
        {type === 'bonsai' && (
          <>
            <ellipse cx="50" cy="90" rx="18" ry="6" fill="#8D6E63" />
            <rect x="46" y="60" width="8" height="30" fill="#795548" />
            <ellipse cx="50" cy="45" rx="30" ry="25" fill={treeColor} />
          </>
        )}
        {(type === 'oak' || !type) && (
          <>
            <rect x="44" y="55" width="12" height="40" fill="#795548" />
            <ellipse cx="50" cy="35" rx="40" ry="35" fill={treeColor} />
          </>
        )}
      </svg>
    </div>
  );
}

export default function ForestView({ plantedTrees, totalPomodoros }) {
  const trees = useMemo(() => {
    return plantedTrees.map((tree, index) => ({
      ...tree,
      type: tree.type || getTreeTypeForPomodoros(totalPomodoros),
    }));
  }, [plantedTrees, totalPomodoros]);

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#252B27] rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2D3830] dark:text-[#E8EBE4]">
          Your Forest
        </h3>
        <span className="text-xs text-[#5C6B60] dark:text-[#9CA89F]">
          {trees.length} trees
        </span>
      </div>
      {trees.length === 0 ? (
        <p className="text-sm text-[#5C6B60] dark:text-[#9CA89F] text-center py-4">
          Plant your first tree by completing a pomodoro!
        </p>
      ) : (
        <div className="grid grid-cols-6 gap-2">
          {trees.map((tree, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
              title={`${tree.type} tree`}
            >
              <MiniTree type={tree.type} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
