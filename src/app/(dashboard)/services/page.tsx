"use client";

import React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Database,
  Edit,
  Trash2,
  Plus,
  X,
  Package,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, ServiceSchema } from "@/lib/validations";
import { toast } from "sonner";
import { Service, useServiceStore } from "@/lib/store";

export default function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedServices, setExpandedServices] = useState<
    Record<string, boolean>
  >({});

  const services = useServiceStore(state => state.services);

  const getServices = useServiceStore(state => state.getServices)

  const serviceForm = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      variables: [{ key: "", required: false }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: serviceForm.control,
    name: "variables",
    rules: { minLength: 1 },
  });

  const addNewService = async ({ name, variables }: ServiceSchema) => {
    const request = await fetch("/api/service", {
      method: "POST",
      body: JSON.stringify({ name, variables }),
    });
    const response = await request.json();
    if (request.status !== 200) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  const addNewVariables = async (
    service: Service,
    variables: { key: string; required?: boolean | undefined }[],
  ) => {
    const request = await fetch("/api/variables", {
      method: "PUT",
      body: JSON.stringify({ service_id: service.id, variables }),
    });
    const response = await request.json();
    if (request.status !== 200) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  const editService = async (
    service: Service,
    { name, variables }: ServiceSchema,
  ) => {

    const request = await fetch("/api/service", {
      method: "PUT",
      body: JSON.stringify({ service_id: service.id, name, variables }),
    });

    const response = await request.json();
    if (request.status !== 200) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  const handleAddService = async ({ name, variables }: ServiceSchema) => {
    try {
      setLoading(true);
      if (editingService && currentService) {
        await editService(currentService, { name, variables });
      } else if (currentService) {
        await addNewVariables(currentService, variables);
        setCurrentService(null);
      } else {
        await addNewService({ name, variables });
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        "an error occured while saving your service, please try again later",
      );
    } finally {
      await getServices()
      setModalOpen(false);
      setLoading(false);
      serviceForm.reset();
    }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [editingService, setEditingService] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleExpanded = (id: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        opacity: { duration: 0.5 },
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleAddVariables = (service: Service) => {
    setCurrentService(service)
    serviceForm.setValue("name", service.name);
    setModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteService = async () => {
    try {
      if (!serviceToDelete) {
        return
      }
      const request = await fetch("/api/service", {
        method: "DELETE",
        body: JSON.stringify({ service_id: serviceToDelete })
      })
      const response = await request.json()
      if (request.status !== 200) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "an error occured while deleting your service, please try again later",
      );
    } finally {
      await getServices()
      setDeleteConfirmOpen(false)
      setServiceToDelete(null)
    }
    // if (serviceToDelete) {
    //   const request = await fetch("/api/")
    //   setDeleteConfirmOpen(false);
    //   setServiceToDelete(null);
    // }
  };

  const handleEditService = (service: Service) => {

    const existingVariables = service.variables.map((variable) => ({
      id: variable.id,
      key: variable.key,
      required: variable.required,
      serviceId: variable.serviceId,
    }));

    serviceForm.setValue("name", service.name);
    serviceForm.setValue("variables", existingVariables);
    setEditingService(true);
    setCurrentService(service);
    setModalOpen(true);
  };

  const onCloseModal = () => {
    serviceForm.reset();
    setCurrentService(null);
    setEditingService(false);
    setModalOpen(false);
  };

  const toggleRequired = (index: number) => {
    const currentVariables = serviceForm.getValues("variables")[index]
    update(index, {
      ...currentVariables,
      required: !currentVariables.required,
    })
  }

  return (
    <>
      {/* Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingService
                    ? "Edit Service"
                    : currentService
                      ? "Add Variables"
                      : "Add New Service"}
                </h3>
                <button
                  onClick={onCloseModal}
                  className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={serviceForm.handleSubmit(handleAddService)}>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  {/* Service Name Input (only for new service or editing service) */}
                  {(editingService || !currentService) && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Service Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                        placeholder="e.g. PostgreSQL, Redis, Authentication"
                        {...serviceForm.register("name")}
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    {fields.map((variable, index) => (
                      <motion.div
                        key={variable.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Key <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder="VARIABLE_NAME"
                              {...serviceForm.register(
                                `variables.${index}.key`,
                              )}
                            />
                          </div>
                        </div>
                        <div className="pt-6 flex items-center space-x-2">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                              Required
                            </span>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleRequired(index)}
                              value={variable.required ?? false}
                              className={cn(
                                "w-8 h-4 rounded-full relative cursor-pointer transition-colors",
                                variable.required
                                  ? "bg-[#006D77] dark:bg-[#83C5BE]"
                                  : "bg-gray-300 dark:bg-gray-600",
                              )}
                            >
                              <motion.div
                                className="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all"
                                animate={{
                                  left: variable.required
                                    ? "calc(100% - 14px)"
                                    : "2px",
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              />
                            </motion.div>
                          </div>
                          <button
                            onClick={() => remove(index)}
                            className="p-1 rounded-md text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            disabled={fields.length === 1}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {!editingService && (<motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => append({ key: "", required: false })}
                    className="mt-4 flex items-center text-sm text-[#006D77] dark:text-[#83C5BE] hover:underline"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Another Variable
                  </motion.button>)}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onCloseModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-[#006D77] hover:bg-[#006D77]/90 text-white rounded-md transition-colors"
                    type="submit"
                    disabled={!serviceForm.formState.isValid || loading}
                  >
                    {editingService
                      ? "Update Service"
                      : currentService
                        ? "Add Variables"
                        : "Create Service"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Confirm Deletion
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this service? This action
                  cannot be undone and all associated variables will be
                  permanently removed.
                </p>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDeleteService}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your environment variable services and their
              configurations.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-[#006D77] hover:bg-[#006D77]/90 text-white rounded-md transition-colors flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            Add New Service
          </motion.button>
        </div>

        {services?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Database
                size={24}
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Services Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first service to start managing environment variables.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-[#006D77] hover:bg-[#006D77]/90 text-white rounded-md transition-colors inline-flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add New Service
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services?.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                layout
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#83C5BE]/20 flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mr-3">
                        <Package />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {service.variables.length} variables
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditService(service)}
                        className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1 rounded-md text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last modified {timeAgo(service.updatedAt!)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleExpanded(service.id)}
                      className="text-xs text-[#006D77] dark:text-[#83C5BE] hover:underline flex items-center"
                    >
                      {expandedServices[service.id] ? (
                        <>
                          Hide Details{" "}
                          <ChevronDown size={14} className="ml-1" />
                        </>
                      ) : (
                        <>
                          View Details{" "}
                          <ChevronRight size={14} className="ml-1" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {expandedServices[service.id] && (
                    <motion.div
                      key={"expandable"}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Variables
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddVariables(service)}
                            className="text-xs text-[#006D77] dark:text-[#83C5BE] hover:underline flex items-center"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Variables
                          </motion.button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-sm">
                          <div className="grid grid-cols-[1fr,auto] gap-2">
                            {service.variables.map((variable, index) => (
                              <React.Fragment key={index}>
                                <div className="font-medium">
                                  {variable.key}
                                </div>
                                <div className="flex items-center">
                                  {variable.required && (
                                    <span className="text-xs bg-[#83C5BE]/20 text-[#006D77] dark:text-[#83C5BE] px-2 py-0.5 rounded">
                                      Required
                                    </span>
                                  )}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </>
  );
}
