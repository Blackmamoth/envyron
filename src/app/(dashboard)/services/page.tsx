
"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Database,
  Lock,
  Server,
  Edit,
  Trash2,
  Plus,
  X,
  Menu,
  User,
  Settings,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"

type Service = {
  id: string
  name: string
  icon: React.ReactNode
  variables: Variable[]
  lastModified: string
}

type Variable = {
  key: string
  value: string
  required: boolean
}

export default function ServicesPage() {
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [variables, setVariables] = useState<Variable[]>([{ key: "", value: "", required: true }])
  const [services, setServices] = useState<Service[]>([
    {
      id: "postgres",
      name: "PostgreSQL",
      icon: <Database size={18} />,
      variables: [
        { key: "POSTGRES_USER", value: "admin", required: true },
        { key: "POSTGRES_PASSWORD", value: "secure_password", required: true },
        { key: "POSTGRES_HOST", value: "localhost", required: true },
        { key: "POSTGRES_PORT", value: "5432", required: true },
        { key: "POSTGRES_DB", value: "myapp", required: true },
      ],
      lastModified: "2 days ago",
    },
    {
      id: "redis",
      name: "Redis",
      icon: <Database size={18} />,
      variables: [
        { key: "REDIS_HOST", value: "localhost", required: true },
        { key: "REDIS_PORT", value: "6379", required: true },
        { key: "REDIS_PASSWORD", value: "", required: false },
      ],
      lastModified: "1 week ago",
    },
    {
      id: "auth",
      name: "Authentication",
      icon: <Lock size={18} />,
      variables: [
        { key: "JWT_SECRET", value: "your_jwt_secret", required: true },
        { key: "JWT_EXPIRES_IN", value: "7d", required: false },
        { key: "REFRESH_TOKEN_SECRET", value: "your_refresh_token_secret", required: true },
      ],
      lastModified: "3 days ago",
    },
    {
      id: "api",
      name: "External API",
      icon: <Globe size={18} />,
      variables: [
        { key: "API_URL", value: "https://api.example.com", required: true },
        { key: "API_KEY", value: "your_api_key", required: true },
        { key: "API_VERSION", value: "v1", required: false },
      ],
      lastModified: "1 day ago",
    },
  ])

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [newServiceName, setNewServiceName] = useState("")
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null)




  const toggleExpanded = (id: string) => {
    setExpandedService(expandedService === id ? null : id)
  }

  const addVariable = () => {
    setVariables([...variables, { key: "", value: "", required: true }])
  }

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index))
  }

  const updateVariable = (index: number, field: keyof Variable, value: string | boolean) => {
    const newVariables = [...variables]
    newVariables[index] = { ...newVariables[index], [field]: value }
    setVariables(newVariables)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const handleAddVariables = (serviceId: string) => {
    setCurrentServiceId(serviceId)
    setVariables([{ key: "", value: "", required: true }])
    setModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setVariables([...service.variables])
    setModalOpen(true)
  }

  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      setServices(services.filter((service) => service.id !== serviceToDelete))
      setDeleteConfirmOpen(false)
      setServiceToDelete(null)
    }
  }

  const isFormValid = () => {
    if (!currentServiceId && !editingService && !newServiceName.trim()) {
      return false
    }

    return variables.every((variable) => variable.key.trim() !== "")
  }

  const handleSaveService = () => {
    if (editingService) {
      // Update existing service
      setServices(
        services.map((service) =>
          service.id === editingService.id ? { ...editingService, variables, lastModified: "just now" } : service,
        ),
      )
    } else if (currentServiceId) {
      // Add variables to existing service
      setServices(
        services.map((service) =>
          service.id === currentServiceId
            ? {
              ...service,
              variables: [...service.variables, ...variables.filter((v) => v.key.trim() !== "")],
              lastModified: "just now",
            }
            : service,
        ),
      )
    } else {
      // Create new service
      const newService: Service = {
        id: Date.now().toString(),
        name: newServiceName,
        icon: <Database size={18} />,
        variables: variables.filter((v) => v.key.trim() !== ""),
        lastModified: "just now",
      }
      setServices([...services, newService])
    }

    setModalOpen(false)
    setEditingService(null)
    setCurrentServiceId(null)
    setNewServiceName("")
    setVariables([{ key: "", value: "", required: true }])
  }

  return (

    <>
      {/* Modal Overlay */}
      <AnimatePresence>
        {
          modalOpen && (
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
                    {editingService ? "Edit Service" : currentServiceId ? "Add Variables" : "Add New Service"}
                  </h3>
                  <button
                    onClick={() => {
                      setModalOpen(false)
                      setEditingService(null)
                      setCurrentServiceId(null)
                      setNewServiceName("")
                      setVariables([{ key: "", value: "", required: true }])
                    }}
                    className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  {/* Service Name Input (only for new service or editing service) */}
                  {!currentServiceId && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Service Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingService ? editingService.name : newServiceName}
                        onChange={(e) => {
                          if (editingService) {
                            setEditingService({ ...editingService, name: e.target.value })
                          } else {
                            setNewServiceName(e.target.value)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                        placeholder="e.g. PostgreSQL, Redis, Authentication"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    {variables.map((variable, index) => (
                      <motion.div
                        key={index}
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
                              value={variable.key}
                              onChange={(e) => updateVariable(index, "key", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder="VARIABLE_NAME"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Value <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                              type="text"
                              value={variable.value}
                              onChange={(e) => updateVariable(index, "value", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder="value"
                            />
                          </div>
                        </div>
                        <div className="pt-6 flex items-center space-x-2">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Required</span>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateVariable(index, "required", !variable.required)}
                              className={cn(
                                "w-8 h-4 rounded-full relative cursor-pointer transition-colors",
                                variable.required ? "bg-[#006D77] dark:bg-[#83C5BE]" : "bg-gray-300 dark:bg-gray-600",
                              )}
                            >
                              <motion.div
                                className="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all"
                                animate={{ left: variable.required ? "calc(100% - 14px)" : "2px" }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </motion.div>
                          </div>
                          <button
                            onClick={() => removeVariable(index)}
                            className="p-1 rounded-md text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            disabled={variables.length === 1}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addVariable}
                    className="mt-4 flex items-center text-sm text-[#006D77] dark:text-[#83C5BE] hover:underline"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Another Variable
                  </motion.button>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setModalOpen(false)
                      setEditingService(null)
                      setCurrentServiceId(null)
                      setNewServiceName("")
                      setVariables([{ key: "", value: "", required: true }])
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveService}
                    className="px-4 py-2 bg-[#006D77] hover:bg-[#006D77]/90 text-white rounded-md transition-colors"
                    disabled={!isFormValid()}
                  >
                    {editingService ? "Update Service" : currentServiceId ? "Add Variables" : "Create Service"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {
          deleteConfirmOpen && (
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Deletion</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this service? This action cannot be undone and all associated
                    variables will be permanently removed.
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
          )
        }
      </AnimatePresence >


      {/* Main Content */}
      < main className="container mx-auto px-4 py-6" >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your environment variable services and their configurations.
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

        {
          services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Database size={24} className="text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Services Yet</h3>
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
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  variants={item}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#83C5BE]/20 flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mr-3">
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{service.variables.length} variables</p>
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
                        Last modified {service.lastModified}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleExpanded(service.id)}
                        className="text-xs text-[#006D77] dark:text-[#83C5BE] hover:underline flex items-center"
                      >
                        {expandedService === service.id ? (
                          <>
                            Hide Details <ChevronDown size={14} className="ml-1" />
                          </>
                        ) : (
                          <>
                            View Details <ChevronRight size={14} className="ml-1" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedService === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">Variables</h4>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddVariables(service.id)}
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
                                  <div className="font-medium">{variable.key}</div>
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
          )
        }
      </main >
    </>
  )
}
