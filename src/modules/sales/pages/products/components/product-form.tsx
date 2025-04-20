/* eslint-disable multiline-ternary */
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PrivateRoutes } from '@/models/routes.model'
import {
  useCreateProduct,
  useGetProduct
  // ,useUpdateProduct
} from '@/modules/sales/hooks/useProduct'
import {
  useCreateCategory,
  useGetAllCategory,
  useDeleteCategory
} from '@/modules/sales/hooks/useCategory'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type Category } from '@/modules/sales/models/category.model'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const formSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  stock_minimum: z
    .number({ required_error: 'El stock mínimo es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El stock mínimo es requerido'),
  stock: z
    .number({ required_error: 'El stock es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El stock es requerido'),
  purchase_price: z
    .number({ required_error: 'El precio de compra es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El precio de compra es requerido'),
  sale_price: z
    .number({ required_error: 'El precio de venta es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El precio de venta es requerido'),
  is_active: z.boolean().optional(),
  category: z
    .string()
    .min(1, 'La categoría es requerida')
})

const ProductFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Producto', path: PrivateRoutes.PRODUCT },
    { label: title }
  ])
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()
  const { createProduct, isMutating } = useCreateProduct()
  // const { updateProduct } = useUpdateProduct()
  const { product } = useGetProduct(id)
  const { allCategories, mutate } = useGetAllCategory()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      stock_minimum: product?.stock_minimum ?? 0,
      stock: product?.stock ?? 0,
      purchase_price: product?.purchase_price ?? 0,
      sale_price: product?.sale_price ?? 0,
      is_active: product?.is_active ?? false,
      category: product?.category?.id ?? ''
    }
  })
  type FormData = z.infer<typeof formSchema>

  const onSubmit = (data: FormData) => {
    if (id) {
      // toast.promise(updateProduct({ id, ...data }), {
      //   loading: 'Actualizando producto...',
      //   success: () => {
      //     setTimeout(() => {
      //       navigate(PrivateRoutes.PRODUCT, { replace: true })
      //     }, 1000)
      //     return 'Producto actualizado exitosamente'
      //   },
      //   error(error) {
      //     return error.errorMessages[0] ?? 'Error al actualizar el producto'
      //   }
      // })
    } else {
      toast.promise(createProduct({ ...data, category_id: data.category }), {
        loading: 'Creando producto...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.PRODUCT, { replace: true })
          }, 1000)
          return 'Producto creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear el producto'
        }
      })
    }
  }

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full flex flex-col gap-4 lg:gap-6"
        >
          <div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => {
                  navigate(PrivateRoutes.PRODUCT)
                }}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Button>
              <h2 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  type="button"
                  onClick={() => {
                    navigate(PrivateRoutes.PRODUCT)
                  }}
                  variant="outline"
                  size="sm"
                >
                  Descartar
                </Button>
                <Button type="submit" size="sm" disabled={isMutating}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:gap-6 md:grid-cols-4">
            <Card className="w-full md:col-span-3">
              <CardHeader>
                <CardTitle>Datos del Producto</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el nombre del producto"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="stock_minimum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Minimo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="purchase_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio de Compra</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sale_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio de Venta</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe una descripción"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="w-full md:col-span-1">
              <CardHeader>
                <CardTitle>Asignación</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => {
                    const { deleteCategory } = useDeleteCategory()
                    const { createCategory } = useCreateCategory()
                    const [open, setOpen] = useState(false)
                    const [newCategoryName, setNewCategoryName] = useState('')
                    const [newCategoryDesc, setNewCategoryDesc] = useState('')

                    const handleDelete = (id: string) => {
                      toast.promise(deleteCategory(id), {
                        loading: 'Eliminando...',
                        success: () => {
                          void mutate()
                          return 'Categoría eliminada'
                        },
                        error: 'No se pudo eliminar la categoría'
                      })
                    }

                    const handleCreate = () => {
                      toast.promise(
                        createCategory({
                          name: newCategoryName,
                          description: newCategoryDesc
                        }),
                        {
                          loading: 'Creando...',
                          success: () => {
                            void mutate()
                            setOpen(false)
                            return 'Categoría creada'
                          },
                          error: 'No se pudo crear la categoría'
                        }
                      )
                    }

                    return (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {allCategories.map((category: Category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                  className="flex items-center justify-between"
                                >
                                  <span>{category.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDelete(category.id)
                                    }}
                                  >
                                    ✕
                                  </Button>
                                </SelectItem>
                              ))}
                              <div className="px-2 py-1.5 border-t mt-1">
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      + Crear nueva categoría
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Nueva Categoría</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label>Nombre</Label>
                                        <Input
                                          placeholder="Ej. Electrónica"
                                          value={newCategoryName}
                                          onChange={(e) =>
                                            setNewCategoryName(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label>Descripción</Label>
                                        <Textarea
                                          placeholder="Ej. Productos electrónicos y tecnología"
                                          value={newCategoryDesc}
                                          onChange={(e) =>
                                            setNewCategoryDesc(e.target.value)
                                          }
                                          className="min-h-[80px]"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter className="gap-2 sm:justify-end">
                                      <DialogClose asChild>
                                        <Button variant="outline">
                                          Cancelar
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        onClick={handleCreate}
                                        disabled={!newCategoryName.trim()}
                                      >
                                        Crear
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(PrivateRoutes.PRODUCT)
              }}
            >
              Descartar
            </Button>
            <Button type="submit" size="sm" disabled={isMutating}>
              {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default ProductFormPage
