import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useGetAllProduct } from '../../hooks/useProduct'
import { useGetAllCustomer } from '@/modules/users/hooks/useCustomer'
import { useValidateOpenCash } from '../../hooks/useCash'
import { useCreateSale } from '../../hooks/useSale'
import Skeleton from '@/components/shared/skeleton'
import { ChevronLeftIcon, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import { useNavigate } from 'react-router-dom'
import { type Product } from '../../models/product.model'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type User } from '@/modules/users/models/user.model'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const formSchema = z.object({
  customer: z.string(),
  cash_register: z.string(),
  nit: z.string().optional(),
  details: z.array(
    z.object({
      product: z.string().min(1, { message: 'El producto es requerido' }),
      quantity: z.number().min(1, { message: 'La cantidad es requerida' }),
      price: z.number().min(1, { message: 'El subtotal es requerido' })
    })
  )
})

const SalePage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Carrito de Compras' }
  ])
  const navigate = useNavigate()
  const { allProducts, isLoading: isLoadingProducts, search } = useGetAllProduct()
  const { allCustomers, isLoading: isLoadingCustomers } = useGetAllCustomer()
  const { createSale } = useCreateSale()
  const { cash } = useValidateOpenCash()
  const [cart, setCart] = useState<Array<{ product: string, quantity: number, price: number }>>([])

  const [searchProduct, setSearchProduct] = useState('')
  const debounceSearchProduct = useDebounce(searchProduct, 1000)
  useEffect(() => {
    search('name', debounceSearchProduct)
  }, [debounceSearchProduct])

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product === product.id)
      if (existingProduct) {
        return prevCart.map((item) =>
          item.product === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { product: product.id, quantity: 1, price: product.sale_price }]
      }
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      customer: '',
      cash_register: cash?.id ?? '',
      nit: '',
      details: []
    }
  })

  type FormData = z.infer<typeof formSchema>

  const onSubmit = async (data: FormData) => {
    const saleDetails = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price
    }))

    const formData = {
      ...data,
      details: saleDetails
    }

    toast.promise(createSale(formData), {
      loading: 'Creando venta...',
      success: () => {
        return 'Venta creada con éxito'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al crear la venta'
      }
    })
  }

  return (
    <section className="grid gap-4 overflow-hidden w-full relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full flex flex-col gap-4 lg:gap-6"
        >
          <div className="inline-flex items-center flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                navigate(PrivateRoutes.SALE)
              }}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Button>
            <div
              className="py-1"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar"
                  className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
                  onChange={(e) => {
                    setSearchProduct(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field?.onChange || (() => {})}
                                  value={field ? field.value : ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCustomers
                            ? <SelectItem value="loading" disabled>
                                Cargando clientes...
                              </SelectItem>
                            : allCustomers?.map((customer: User) => (
                              <SelectItem
                                key={customer.id}
                                value={customer.id}
                                className="flex items-center justify-between"
                              >
                                <span>{customer.name}</span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="NIT del cliente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="grid gap-4 lg:gap-6 md:grid-cols-3">
            <Card className="w-full md:col-span-2">
              <CardHeader>
                <CardTitle>Todos los productos</CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-3 gap-4 mb-4'>
                {isLoadingProducts
                  ? <Skeleton rows={3} columns={2} />
                  : allProducts?.map((product: Product) => (
                  <Card key={product.id} className="mb-4">
                  <CardHeader>
                    <img
                      src={'/path/to/default-image.jpg'}
                      alt={product.name}
                      className="w-full h-40 object-cover bg-gray-200"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center mb-4">
                      <Button
                        type='button'
                        onClick={() => handleAddToCart(product)}
                      >
                      Agregar
                      </Button>
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <p>{product.description}</p>
                    <p>${product.sale_price}</p>
                  </CardContent>
                </Card>))}
              </CardContent>
            </Card>
            <Card className="w-full md:col-span-1">
              <CardHeader>
                <CardTitle>Carrito de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                { cart.length === 0
                  ? <p>No hay productos en el carrito.</p>
                  : cart.map((item) => {
                    const product = allProducts.find((p: Product) => p.id === item.product)
                    return product
                      ? <div key={item.product} className="flex justify-between items-center mb-2">
                          <span>{product.name}</span>
                          <span>{item.quantity} x ${item.price}</span>
                        </div>
                      : null
                  })
                }
              </CardContent>
              <CardFooter>
                <Button
                  type='submit'
                  className="w-full"
                  disabled={cart.length === 0}
                >
                  Realizar venta
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default SalePage
