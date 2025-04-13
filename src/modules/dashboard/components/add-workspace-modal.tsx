import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { z } from 'zod'
import { type Dispatch, type SetStateAction } from 'react'
import { type ApiResponse, type IFormProps } from '@/models'
import { type KeyedMutator } from 'swr'
import { AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useCreateResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'

const formSchema = z.object({
  name: z.string().min(2).max(50)
})

interface IForm extends IFormProps {
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  mutate?: KeyedMutator<ApiResponse>
}

const AddWorkspaceModal = ({ buttonText, title, mutate, setOpenModal }: IForm) => {
  const [searchParams, setSearchParams] = useSearchParams()
  // const { updateCategory, isMutating: isMutatingUpdate } = useUpdateCategory()
  const { createResource: create, isMutating: isMutatingCreate } = useCreateResource({ endpoint: ENDPOINTS.WORKSPACE })
  const { createResource: update, isMutating: isMutatingUpdate } = useCreateResource({ endpoint: ENDPOINTS.WORKSPACE, id: searchParams.get('id') ?? '' })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: searchParams.get('name') ?? ''
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast.promise(
      searchParams.get('id') && searchParams.get('name')
        ? update({ id: searchParams.get('id')!, name: data.name })
        : create({ name: data.name }),
      {
        loading: 'Cargando...',
        success: () => {
          if (mutate) {
            void mutate()
          }
          setTimeout(() => {
            form.reset()
            form.resetField('name')
            searchParams.delete('id')
            setSearchParams(searchParams)
            setOpenModal?.(false)
          }, 500)
          return `Workspace ${searchParams.get('id') ? 'actualizado' : 'creado'} exitosamente`
        },
        error(error) {
          return error?.errorMessages[0] ?? 'Error al crear el workspace'
        }
      })
  }

  return (
    <>
      <section className="grid flex-1 items-start gap-4 lg:gap-6">
        <Form {...form}>
          <form onSubmit={() => { }} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>
                Dale un nombre descriptivo a tu nuevo espacio de trabajo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4 lg:gap-6" >
              <FormField
                control={form.control}
                name="name"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Nombre</FormLabel> */}
                    <FormControl>
                      <Input placeholder="Nombre del workspace" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AlertDialogFooter className="flex items-center justify-center gap-2">
              <AlertDialogCancel asChild>
                <Button type='button' variant="outline" size="sm" onClick={() => {
                  // searchParams.delete('id')
                  // searchParams.delete('nombre')
                  // searchParams.delete('descripcion')
                  // searchParams.delete('imagen')
                  setSearchParams(searchParams)
                }}>
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <Button
                type='submit'
                size="sm"
                disabled={isMutatingCreate || isMutatingUpdate}
                onClick={form.handleSubmit(onSubmit)}
              > {searchParams.get('id') ? 'Actualizar' : buttonText}</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </section>
    </>
  )
}

export default AddWorkspaceModal
