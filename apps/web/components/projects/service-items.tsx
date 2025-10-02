import type { EnvVariable, Service } from "@envyron/types";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";

type Props = {
  item: Service;
  isEnabled: boolean;
  isExpanded: boolean;
  serviceVariables: EnvVariable[];
  variableConfigs: Record<string, { included: boolean; required: boolean }>;
  onToggleService: () => void;
  onToggleExpansion: () => void;
  onRemoveService: () => void;
  onToggleVariableIncluded: (variableName: string) => void;
  onToggleVariableRequired: (variableName: string) => void;
};

export function ServiceItems({
  item,
  isEnabled,
  isExpanded,
  serviceVariables,
  variableConfigs,
  onToggleService,
  onToggleExpansion,
  onRemoveService,
  onToggleVariableIncluded,
  onToggleVariableRequired,
}: Props) {
  return (
    <div className="space-y-2">
      <div
        className={`flex items-center justify-between p-3 rounded-lg hover:bg-[#006D77]/10 transition-colors group ${
          !isEnabled ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          <button
            type="button"
            onClick={onToggleExpansion}
            className="p-1 hover:bg-[#006D77]/20 rounded transition-colors"
            aria-label={isExpanded ? "Collapse service" : "Expand service"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-[#83C5BE]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>

          <div className="flex-1">
            <h3 className="font-medium font-mono">{item.name}</h3>
            <p className="text-xs text-gray-400 capitalize">service</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggleService}
            className="data-[state=checked]:bg-[#006D77]"
            aria-label={`${isEnabled ? "Disable" : "Enable"} ${item.name}`}
          />
          <button
            type="button"
            aria-label="Remove Service"
            onClick={onRemoveService}
            className="p-2 rounded transition-colors text-gray-400 hover:text-[var(--envyron-destructive)] hover:bg-[color:var(--envyron-destructive)]/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isEnabled && serviceVariables && isExpanded && (
        <div className="ml-3 mt-3 space-y-1">
          <div className="flex items-center gap-2 px-3 py-1">
            <div className="w-1 h-4 bg-[#006D77] rounded-full" />
            <h4 className="text-xs font-medium text-[#83C5BE] uppercase tracking-wide">
              Environment Variables
            </h4>
          </div>

          <div className="space-y-1 pl-2">
            {serviceVariables.map((variable) => {
              const config = variableConfigs[variable.key];
              const isIncluded = config?.included !== false;
              const isRequired = config?.required !== false;

              return (
                <div
                  key={variable.key}
                  className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-200 group hover:bg-[#006D77]/10 ${
                    !isIncluded
                      ? "opacity-40"
                      : "hover:shadow-sm hover:shadow-[#006D77]/20"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={isIncluded}
                      onCheckedChange={() =>
                        onToggleVariableIncluded(variable.key)
                      }
                      className="data-[state=checked]:bg-[#006D77] data-[state=checked]:border-[#006D77] shrink-0"
                      aria-label={`${isIncluded ? "Exclude" : "Include"} ${variable.key}`}
                    />
                    <span
                      className={`text-sm font-mono font-medium transition-all duration-200 truncate ${
                        isIncluded
                          ? "text-white group-hover:text-[#83C5BE]"
                          : "text-gray-500 line-through"
                      }`}
                    >
                      {variable.key}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 font-medium">
                      Required
                    </span>
                    <Switch
                      checked={isRequired}
                      onCheckedChange={() =>
                        onToggleVariableRequired(variable.key)
                      }
                      className="data-[state=checked]:bg-[#006D77] scale-75"
                      disabled={!isIncluded}
                      aria-label={`Mark ${variable.key} as ${isRequired ? "optional" : "required"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
