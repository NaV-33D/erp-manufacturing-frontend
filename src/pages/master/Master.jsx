import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import UsersTab from "./components/UsersTab";
import ModulesTab from "./components/ModulesTab";
import PermissionsTab from "./components/PermissionsTab";
import RolesTab from "./components/RolesTab";
import WarehouseTab from "./components/WarehouseTab";

const TAB_CONFIG = [
  { key: "Users", component: UsersTab },
  { key: "Modules", component: ModulesTab },
  { key: "Permissions", component: PermissionsTab },
  { key: "Roles", component: RolesTab },
  { key: "Warehouses", component: WarehouseTab },
];

const Masters = () => {
  const [activeTab, setActiveTab] = useState("Users");

  const activeConfig =
    TAB_CONFIG.find((t) => t.key === activeTab) || TAB_CONFIG[0];

  const ActiveComponent = activeConfig.component;

  return (
    <div>
      <PageHeader
        title="Masters"
        subtitle="Configure master data and access control rules"
        actions={
          <div className="flex gap-2">
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Import
            </button>
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Export
            </button>
          </div>
        }
      />

      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition",
                activeTab === tab.key
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900",
              ].join(" ")}
            >
              {tab.key}
            </button>
          ))}
        </div>
      </div>

      {/* Real Component Rendered Here */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Masters;
