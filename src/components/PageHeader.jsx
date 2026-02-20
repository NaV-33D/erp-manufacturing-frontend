import React from "react";
import Breadcrumbs from "./header/Breadcrumbs";

const PageHeader = ({ title, subtitle, actions, breadcrumbs = [] }) => {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs?.length > 0 && (
        <div className="mb-2">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {actions && (
          <div className="w-full md:w-auto">
            <div className="flex flex-wrap gap-2 md:justify-end">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
