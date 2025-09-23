"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  type EnvVariableSchema,
  type EnvVariableTypes,
  envVariableSchema,
} from "@/lib/validation";
import { useFetchVariables, useSyncVariables } from "@/hooks/use-variable";

type Props = {
  serviceId: string;
};

export default function ServiceBody({ serviceId }: Props) {
  const syncVariablesMutation = useSyncVariables(serviceId);

  const { variables } = useFetchVariables(serviceId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isValid, isDirty },
  } = useForm({
    resolver: zodResolver(envVariableSchema),
    defaultValues: {
      env_variables: [],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    name: "env_variables",
    control,
  });

  const handleSync = (data: EnvVariableSchema) => {
    syncVariablesMutation.mutate(data);
  };

  useEffect(() => {
    if (variables?.length) {
      reset({
        env_variables: variables.map((v) => ({
          key: v.key,
          defaultValue: v.defaultValue ?? "",
          required: v.required,
          type: v.type,
        })),
      });
    }
  }, [variables, reset]);

  return (
    <form onSubmit={handleSubmit(handleSync)}>
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24 space-y-8">
        {/* Environment Variables Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Environment Variables
            </h2>
            <Button
              onClick={() =>
                append({
                  key: "",
                  type: "STRING",
                  required: false,
                  defaultValue: "",
                })
              }
              variant="outline"
              className="border-[#006D77] text-[#006D77] hover:bg-[#006D77] hover:text-white transition-all duration-200 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Variable
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg mb-2">No variables yet</div>
              <div className="text-sm">
                Add your first environment variable to get started
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-[#1a2951] border border-gray-700 rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`env_variables.${index}.key`}
                        className="text-xs font-medium text-gray-400 uppercase tracking-wide"
                      >
                        Key *
                      </label>
                      <Input
                        placeholder="API_KEY"
                        className="bg-[#0B1437] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#006D77] focus:ring-[#006D77] font-mono"
                        {...register(`env_variables.${index}.key`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`env_variables.${index}.defaultValue`}
                        className="text-xs font-medium text-gray-400 uppercase tracking-wide"
                      >
                        Default Value
                      </label>
                      <Input
                        placeholder="your-api-key-here"
                        className="bg-[#0B1437] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#006D77] focus:ring-[#006D77] font-mono"
                        {...register(`env_variables.${index}.defaultValue`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`env_variables.${index}.required`}
                        className="text-xs font-medium text-gray-400 uppercase tracking-wide"
                      >
                        Required
                      </label>
                      <div className="flex items-center h-10">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => {
                            const current = getValues(`env_variables.${index}`);
                            update(index, { ...current, required: checked });
                          }}
                          className="data-[state=checked]:bg-[#006D77]"
                        />
                        <span className="ml-2 text-sm text-gray-300">
                          {field.required ? "Required" : "Optional"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`env_variables.${index}.type`}
                        className="text-xs font-medium text-gray-400 uppercase tracking-wide"
                      >
                        Type
                      </label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={field.type}
                          onValueChange={(value) => {
                            const current = getValues(`env_variables.${index}`);
                            update(index, {
                              ...current,
                              type: value as EnvVariableTypes,
                            });
                          }}
                        >
                          <SelectTrigger className="bg-[#0B1437] border-gray-600 text-white focus:border-[#006D77] focus:ring-[#006D77]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0B1437] border-gray-700">
                            <SelectItem
                              value="STRING"
                              className="text-white hover:bg-[#006D77]/20"
                            >
                              string
                            </SelectItem>
                            <SelectItem
                              value="INT"
                              className="text-white hover:bg-[#006D77]/20"
                            >
                              int
                            </SelectItem>
                            <SelectItem
                              value="FLOAT"
                              className="text-white hover:bg-[#006D77]/20"
                            >
                              float
                            </SelectItem>
                            <SelectItem
                              value="BOOLEAN"
                              className="text-white hover:bg-[#006D77]/20"
                            >
                              boolean
                            </SelectItem>
                            <SelectItem
                              value="JSON"
                              className="text-white hover:bg-[#006D77]/20"
                            >
                              JSON
                            </SelectItem>
                            <SelectItem
                              value="URL"
                              className="text-white hover:bg-[#006D77]/20"
                            >
                              URL
                            </SelectItem>
                            <SelectItem
                              value="EMAIL"
                              className="text-white hover:bg-[#006D77]/20"
                            >
                              email
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => remove(index)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0B1437]/95 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Cancel
            </Button>
          </Link>
          <Button
            className="bg-[#006D77] hover:bg-[#83C5BE] text-white font-medium px-8 shadow-lg hover:shadow-[#006D77]/25 transition-all duration-200"
            disabled={!isValid || !isDirty}
          >
            Save Service
          </Button>
        </div>
      </div>
    </form>
  );
}
