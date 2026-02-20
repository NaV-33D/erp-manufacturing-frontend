import React from "react";
import Breadcrumbs from "../header/Breadcrumbs";

const FormPage = ({
  breadcrumb,
  breadcrumbs,
  title,
  topActions,
  children,
  bottomLeft,
  bottomRight,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pb-6">
        <div className="pb-5">
          {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 ? (
            <div className="mb-2">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : (
            breadcrumb && (
              <div className="text-xs text-gray-500 mb-1">{breadcrumb}</div>
            )
          )}

          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

            {topActions && (
              <div className="flex flex-wrap gap-2 md:justify-end">
                {topActions}
              </div>
            )}
          </div>
        </div>

        <div>{children}</div>
      </div>

      {!hideFooter && (
        <div className="sticky bottom-[-24px] bg-white border-t">
          <div className="sm:px-6 p-2 sm:py-4 sm:flex justify-between gap-3">
            <div className="flex gap-2">{bottomLeft}</div>
            <div className="flex gap-2">{bottomRight}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPage;
