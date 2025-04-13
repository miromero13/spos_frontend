import { useLocation, useParams } from 'react-router-dom'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@components/ui/collapsible'
import { ChevronRight, File, Folder, FolderPlus, Plus } from 'lucide-react'
import { useSidebar } from '@/context/sidebarContext'
import { useEffect, useState } from 'react'
import { ENDPOINTS } from '@/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { useCreateResource, useGetResource } from '@/hooks/useApiResource'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from '@/components/ui/context-menu'

const formSchema = z.object({
  name: z.string().min(1).max(50)
})

const formSchemaSheet = z.object({
  name: z.string().min(1).max(50)
})

function Navigation() {
  const {
    isContract, handleSelectedMenu
  } = useSidebar()

  const location = useLocation()
  const { id } = useParams()
  const [isCreateProject, setIsCreateProject] = useState(false)
  const [projectState, setProjectState] = useState([] as any[])
  const [isCreateSheet, setIsCreateSheet] = useState(false)
  const [selectProjectId, setSelectProjectId] = useState('')

  const { resource: workspace, mutate } = useGetResource<any>({ endpoint: `${ENDPOINTS.WORKSPACE}/${id}` })
  const { createResource: createProject } = useCreateResource({ endpoint: `${ENDPOINTS.WORKSPACE}/${id}/project` })
  const { createResource: createSheet } = useCreateResource({ endpoint: `${ENDPOINTS.WORKSPACE}/project/sheet` })

  const formProject = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })

  const formSheet = useForm<z.infer<typeof formSchemaSheet>>({
    resolver: zodResolver(formSchemaSheet),
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    void createProject({ name: data.name })
    setIsCreateProject(false)
    void mutate()
    formProject.reset()
  }

  const onSubmitSheet = (data: z.infer<typeof formSchemaSheet>) => {
    if (data.name.includes('.') || data.name.includes(' ') || data.name.includes(',')) {
      formSheet.setError('name', { message: 'error' })
      return
    }
    void createSheet({ name: data.name, projectId: selectProjectId })
    void mutate()
    setIsCreateSheet(false)
    formSheet.reset()
  }

  let subscribe = true
  useEffect(() => {
    if (subscribe) {
      let currentPathToSelectMenu = location.pathname
      if (currentPathToSelectMenu.includes('crear')) {
        currentPathToSelectMenu = currentPathToSelectMenu.split('/crear')[0]
      }
      if (id) {
        currentPathToSelectMenu = currentPathToSelectMenu.split(`/${id}`)[0]
      }
      handleSelectedMenu && handleSelectedMenu(currentPathToSelectMenu)
    }
    return () => {
      subscribe = false
    }
  }, [location.pathname])

  let subscribe2 = true
  useEffect(() => {
    if (subscribe2) {
      if (workspace && workspace.projects.length > 0) {
        setProjectState(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          workspace.projects.map((p: any) => ({
            name: p.name,
            id: p.id,
            sheets: p.sheets,
            isOpen: false,
            isCreate: false,
            isFocus: false,
            isSelected: false
          }))
        )
      }
    }
    return () => {
      subscribe2 = false
    }
  }, [workspace])

  return (
    <nav className="flex h-full flex-col w-full justify-between overflow-hidden">
      <section className='flex flex-col w-full  h-fit gap-1 items-start p-4 overflow-y-auto relative overflow-x-hidden'>
        <Tabs defaultValue="explorer" className="w-full">
          <TabsList className={`grid w-full grid-cols-2 ${isContract ? 'md:grid-cols-1 aspect-square w-9 mx-auto' : 'lg:grid-cols-2'} `}>
            {!isContract
              ? <>
                <TabsTrigger value="explorer">
                  Explorador
                </TabsTrigger>
                <TabsTrigger value="components">
                  Componentes
                </TabsTrigger></>
              : <Button variant="ghost" size="sm" className='h-8 w-full text-left'>
                ...
              </Button>}
          </TabsList>
          <div className='py-2 flex justify-between px-0 items-center pl-2'>
            {isContract
              ? <h2 className='py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>Proy...</h2>
              : <>
                <h2 className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>Proyectos</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className='h-8 w-8 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                  onClick={() => {
                    setIsCreateProject(true)
                    setIsCreateSheet(false)
                  }}
                >
                  <FolderPlus className='h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary' />
                </Button>
              </>}
          </div>
          {isCreateProject && <Form {...formProject}>
            <form onSubmit={() => { }} className="w-full flex flex-col">
              <FormField
                control={formProject.control}
                name="name"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Button type='button' variant="ghost" size="sm" className='flex items-center justify-between gap-2 h-8 w-full'>
                        <Folder className="h-4 w-4" />
                        <Input
                          placeholder="" {...field} autoFocus={true}
                          className='h-7 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none border border-sky-600 dark:border-sky-600 bg-transparent dark:bg-transparent mx-2 px-1'
                          onBlur={() => {
                            formProject.reset()
                            setIsCreateProject(false)
                            field.onBlur()
                            setIsCreateSheet(false)
                          }}
                        />
                        <ChevronRight className={'h-4 w-4 transition-all'} />
                      </Button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                size="sm"
                onClick={formProject.handleSubmit(onSubmit)}
                className='hidden'
              >sr-none</Button>
            </form>
          </Form>}
          <TabsContent value="explorer" className='mt-0'>
            {projectState.map((project: any) =>
              // eslint-disable-next-line multiline-ternary
              isContract ? <Button key={project.id} variant="ghost" size="sm" className='h-8 w-full text-left'><Folder className="h-4 w-4" /></Button> : (<Collapsible
                key={project.id}
                className="w-full h-fit"
                open={project.isOpen}
                onOpenChange={(open) => {
                  setProjectState((prev) =>
                    prev.map((p) => (p.id === project.id ? { ...p, isOpen: open } : p))
                  )
                }}
              >
                <ContextMenu>
                  <ContextMenuTrigger className="flex h-fit w-full items-center">
                    <CollapsibleTrigger asChild className='w-full'>
                      <Button variant="ghost" size="sm" className='flex items-center justify-between gap-2 h-8'>
                        <Folder className="h-4 w-4" />
                        <span className='w-full text-left'>{project.name}</span>
                        <ChevronRight className={`h-4 w-4 ${project.isOpen ? 'rotate-90' : ''} transition-all`} />
                      </Button>
                    </CollapsibleTrigger>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-64">
                    <ContextMenuItem inset disabled>
                      Editar
                      {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
                    </ContextMenuItem>
                    <ContextMenuItem inset disabled>
                      Eliminar
                      {/* <ContextMenuShortcut>-</ContextMenuShortcut> */}
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem inset onClick={() => {
                      setProjectState((prev) =>
                        prev.map((p) => (p.id === project.id
                          ? { ...p, isCreate: true, isOpen: true, isFocus: true }
                          : { ...p, isCreate: false, isFocus: false }
                        ))
                      )
                      setIsCreateSheet(true)
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      setSelectProjectId(project?.id)
                    }}>
                      Nuevo archivo
                      <ContextMenuShortcut>
                        <Plus className='h-4 w-4' />
                      </ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
                <CollapsibleContent className="h-fit pl-5 relative">
                  {/* {<Form {...formSheet}> */}
                  {project.isCreate && isCreateSheet && <Form {...formSheet}>
                    <form onSubmit={() => { }} className="w-full flex flex-col">
                      <FormField
                        control={formSheet.control}
                        name="name"
                        defaultValue=""
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Button type='button' variant="ghost" size="sm" className='flex items-center justify-between gap-2 h-8 w-full'>
                                <File className="h-4 w-4" />
                                <Input
                                  placeholder="" {...field}
                                  autoFocus={false}
                                  id={project.id}
                                  className={'h-7 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none border border-sky-600 dark:border-sky-600 bg-transparent dark:bg-transparent px-1'}
                                  onBlur={() => {
                                    console.log('blur')
                                    formSheet.reset()
                                    setProjectState((prev) =>
                                      prev.map((p) => (p.id === project.id ? { ...p, isCreate: false, isFocus: false } : p))
                                    )
                                    field.onBlur()
                                    setIsCreateSheet(false)
                                  }}
                                />
                              </Button>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type='submit'
                        size="sm"
                        onClick={formSheet.handleSubmit(onSubmitSheet)}
                        className='hidden'
                      >sr-none</Button>
                    </form>
                  </Form>}
                  {project.sheets?.map((sheet: any) => (
                    <Button key={sheet.id} variant="ghost" size="sm" className='flex items-center justify-between gap-2 h-8 w-full'>
                      <File className="h-4 w-4" />
                      <span className='w-full text-left'>{sheet.name}</span>
                    </Button>
                  ))}
                  {/* <Button variant='ghost' size='sm' className='flex items-center w-full text-left justify-start py-0 h-7 font-normal'>
                      landing-page.lg
                    </Button>
                    <Button variant='ghost' size='sm' className='flex items-center w-full text-left justify-start py-0 h-7 font-normal'>
                      landing-page.lg
                    </Button>
                    <Button variant='ghost' size='sm' className='flex items-center w-full text-left justify-start py-0 h-7 font-normal'>
                      landing-page.lg
                    </Button> */}
                  <hr className='absolute top-0 left-4 h-full border-r border-dashed' />
                </CollapsibleContent>
              </Collapsible>
              )
            )}
          </TabsContent>
          <TabsContent value="components">
            <div>
              <h2 className='text-lg font-bold'>Password</h2>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>Manage your password settings.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </nav >
  )
}

export default Navigation
