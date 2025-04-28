"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Package,
} from "lucide-react"
import { cn, generateEnvContent, generateGolangCode, generateJSCode, generatePythonCode } from "@/lib/utils"
import { EnvVariable, Service, useServiceStore } from "@/lib/store"


export default function DashboardPage() {

  const [activeTab, setActiveTab] = useState<"env" | "python" | "js" | "go">("env")
  const [copied, setCopied] = useState(false)

  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({})
  const [activeServices, setActiveServices] = useState<Record<string, boolean>>({})

  const services = useServiceStore(state => state.services)

  const [localServices, setLocalServices] = useState<Service[]>([])

  const toggleService = (id: string) => {
    setActiveServices(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleExpanded = (id: string) => {
    setExpandedServices(prev => ({ ...prev, [id]: !prev[id] }))
  }



  const toggleRequired = (serviceId: string, variableIndex: number) => {
    setLocalServices((prevServices) => {
      return prevServices.map((service) => {
        if (service.id === serviceId) {
          const newVariables = [...service.variables];
          newVariables[variableIndex] = {
            ...newVariables[variableIndex],
            required: !newVariables[variableIndex].required,
          };
          return { ...service, variables: newVariables };
        }
        return service;
      });
    });
  };



  const handleCopy = () => {
    if (activeTab === "env") {
      const envContent = generateEnvContent(localServices, activeServices)
      navigator.clipboard.writeText(envContent)
    } else {
      const codeContent = getCodeContent()
      navigator.clipboard.writeText(codeContent)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }



  const getCodeContent = () => {
    const activeServicesArr = services.filter((s) => activeServices[s.id] === true)


    const serviceVariablesMap: Record<string, EnvVariable[]> = {};
    activeServicesArr.forEach(service => {
      serviceVariablesMap[service.name] = service.variables;
    });


    switch (activeTab) {
      case "python":
        return generatePythonCode(serviceVariablesMap)
      case "js":
        return generateJSCode(serviceVariablesMap)
      case "go":
        return generateGolangCode(serviceVariablesMap)
      default:
        return generateEnvContent(localServices, activeServices)
    }
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

  useEffect(() => {
    if (services && services.length > 0) {
      setLocalServices(services)
    }
  }, [services])

  useEffect(() => {
    generateEnvContent(localServices, activeServices)
  }, [activeServices])

  return (
    <>
      {/* Main Content */}
      < main className="container mx-auto px-4 py-6" >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Environment Variables</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your environment variables by toggling services and configuring variables.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services Panel */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Services</h3>
            </div>
            <div className="p-4 space-y-4">
              <AnimatePresence>
                {localServices.map((service) => (
                  <motion.div
                    key={service.id}
                    variants={item}
                    layout
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-[#006D77] dark:text-[#83C5BE] mr-2"><Package /></div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleExpanded(service.id)}
                          className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          {expandedServices[service.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </motion.button>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleService(service.id)}
                          className={cn(
                            "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                            activeServices[service.id] ? "bg-[#006D77] dark:bg-[#83C5BE]" : "bg-gray-300 dark:bg-gray-600",
                          )}
                        >
                          <motion.div
                            className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
                            animate={{ left: activeServices[service.id] ? "calc(100% - 18px)" : "2px" }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedServices[service.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 border-t border-gray-200 dark:border-gray-700">


                            <div className="space-y-2">
                              {service.variables.map((variable, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex-1 mr-2">
                                    <div className="text-sm font-medium">{variable.key}</div>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Required</span>
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => toggleRequired(service.id, index)}
                                      className={cn(
                                        "w-8 h-4 rounded-full relative cursor-pointer transition-colors",
                                        variable.required ? "bg-[#006D77] dark:bg-[#83C5BE]"
                                          : "bg-gray-300 dark:bg-gray-600",
                                      )}
                                    >
                                      <motion.div
                                        className="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all"
                                        animate={{ left: variable.required ? "calc(100% - 14px)" : "2px" }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                      />
                                    </motion.div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preview</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex items-center text-sm text-[#006D77] dark:text-[#83C5BE] hover:underline"
              >
                {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("env")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    activeTab === "env"
                      ? "border-b-2 border-[#006D77] dark:border-[#83C5BE] text-[#006D77] dark:text-[#83C5BE]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  .env
                </button>
                <button
                  onClick={() => setActiveTab("python")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    activeTab === "python"
                      ? "border-b-2 border-[#006D77] dark:border-[#83C5BE] text-[#006D77] dark:text-[#83C5BE]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  Python
                </button>
                <button
                  onClick={() => setActiveTab("js")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    activeTab === "js"
                      ? "border-b-2 border-[#006D77] dark:border-[#83C5BE] text-[#006D77] dark:text-[#83C5BE]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  JS/TS
                </button>
                <button
                  onClick={() => setActiveTab("go")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    activeTab === "go"
                      ? "border-b-2 border-[#006D77] dark:border-[#83C5BE] text-[#006D77] dark:text-[#83C5BE]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  Go
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 font-mono text-sm overflow-auto h-[400px]">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap"
                >
                  {getCodeContent()}
                </motion.pre>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main >
    </>
  )
}


