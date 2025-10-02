"use client";

import {
  Edit,
  FileText,
  FolderOpen,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateItemModal from "@/components/dashboard/create-item-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project, Service, Template } from "@envyron/types";
import { useDeleteService, useFetchServices } from "@/hooks/use-service";
import { useDeleteTemplate, useFetchTemplates } from "@/hooks/use-template";
import { useDeleteProject, useFetchProjects } from "@/hooks/use-project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("projects");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<null | {
    id: string;
    name: string;
    type: "projects" | "templates" | "services";
  }>(null);

  const { services } = useFetchServices();

  const { templates } = useFetchTemplates();

  const { projects } = useFetchProjects();

  const { deleteService } = useDeleteService();

  const { deleteTemplate } = useDeleteTemplate();

  const { deleteProject } = useDeleteProject();

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (
    item: Service | Template | Project,
    type: "projects" | "templates" | "services",
  ) => {
    setDeleteTarget({ id: item.id, name: item.name, type });
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      console.log(`Deleting ${deleteTarget.name}`);
      if (deleteTarget.type === "projects") {
        deleteProject({ id: deleteTarget.id });
      } else if (deleteTarget.type === "templates") {
        deleteTemplate({ id: deleteTarget.id });
      } else if (deleteTarget.type === "services") {
        deleteService({ id: deleteTarget.id });
      }
    }
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const renderEmptyState = (type: string) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--envyron-teal)]/20 flex items-center justify-center mb-4">
        {type === "projects" && (
          <FolderOpen className="w-8 h-8 text-[var(--envyron-light-teal)]" />
        )}
        {type === "templates" && (
          <FileText className="w-8 h-8 text-[var(--envyron-light-teal)]" />
        )}
        {type === "services" && (
          <Settings className="w-8 h-8 text-[var(--envyron-light-teal)]" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No {type.charAt(0).toUpperCase() + type.slice(1)} yet
      </h3>
      <p className="text-[var(--envyron-light-teal)]/60 mb-6">
        Create your first {type.slice(0, -1)} to get started
      </p>
    </div>
  );

  const renderItemCards = (
    items: Project[] | Service[] | Template[],
    type: "projects" | "templates" | "services",
  ) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 hover:border-[var(--envyron-light-teal)]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--envyron-light-teal)]/10"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 font-mono">
                  {item.name}
                </h3>
                <p className="text-[var(--envyron-light-teal)]/70 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--envyron-light-teal)] hover:bg-[var(--envyron-teal)]/20"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30">
                  {type === "services" ? (
                    <Link href={`/services/editor/${item.id}`}>
                      <DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                  ) : type === "templates" ? (
                    <Link href={`/templates/builder/${item.id}`}>
                      <DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <Link href={`/projects/workspace/${item.id}`}>
                      <DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">
                        <Edit className="w-4 h-4 mr-2" />
                        Open Workspace
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem
                    className="text-red-400 hover:bg-red-500/20"
                    onClick={() => handleDeleteClick(item, type)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <div className="pt-20 pb-12 px-6">
        <div className="container mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <TabsList className="bg-[var(--envyron-navy)]/60 border border-[var(--envyron-teal)]/30">
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-[var(--envyron-teal)] data-[state=active]:text-white text-[var(--envyron-light-teal)]"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="templates"
                  className="data-[state=active]:bg-[var(--envyron-teal)] data-[state=active]:text-white text-[var(--envyron-light-teal)]"
                >
                  Templates
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-[var(--envyron-teal)] data-[state=active]:text-white text-[var(--envyron-light-teal)]"
                >
                  Services
                </TabsTrigger>
              </TabsList>

              <Button
                onClick={handleCreateClick}
                className="bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>

            <TabsContent value="projects" className="mt-0">
              {projects.length > 0
                ? renderItemCards(projects, "projects")
                : renderEmptyState("projects")}
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              {templates.length > 0
                ? renderItemCards(templates, "templates")
                : renderEmptyState("templates")}
            </TabsContent>

            <TabsContent value="services" className="mt-0">
              {services.length > 0
                ? renderItemCards(services, "services")
                : renderEmptyState("services")}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30 text-white">
          <DialogHeader>
            <DialogTitle>
              {deleteTarget?.type === "projects" && "Delete Project"}
              {deleteTarget?.type === "templates" && "Delete Template"}
              {deleteTarget?.type === "services" && "Delete Service"}
            </DialogTitle>
            <DialogDescription className="text-[var(--envyron-light-teal)]/80">
              {deleteTarget
                ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteTarget(null);
              }}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-(--envyron-destructive) hover:bg-(--envyron-destructive) hover:opacity-90"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <CreateItemModal
        activeTab={activeTab}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        templates={templates}
      />
    </>
  );
}
