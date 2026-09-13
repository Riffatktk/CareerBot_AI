import React from "react";

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-2 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 text-text-3">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-2">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
