import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { useCreateCash, useCloseCash, useValidateOpenCash } from '@/modules/sales/hooks/useCash'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useHeader } from '@/hooks'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useGetResource } from '@/hooks/useApiResource'
import { type Cash } from '../sales/models/cash.model'
import { useReactToPrint } from '@/hooks/usePrint'
import { AppConfig } from '@/config'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  initial_balance: z
    .number({ required_error: 'El monto inicial es requerido' }),
  observations: z
    .string()
    .max(255, 'Las observaciones no pueden exceder los 255 caracteres')
    .optional()
})

const DashboardPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard' }
  ])
  const reporteRef = useRef(null)
  const navigate = useNavigate()
  const { name, role } = useSelector((state: RootState) => state.user)
  const { createCash, isMutating: isMutatingOpen } = useCreateCash()
  const { closeCash, isMutating: isMutatingClose } = useCloseCash()
  const { cash, mutate } = useValidateOpenCash()
  const [openCash, setOpenCash] = useState(false)
  const [open, setOpen] = useState(false)
  const [imprimiendo, setImprimiendo] = useState(false)
  const handlePrint = useReactToPrint({ content: () => reporteRef.current })

  const { resource: cashRegister } = useGetResource<Cash>({ endpoint: `/api/cash_registers/${cash?.id}/` })

  useEffect(() => {
    cash?.validate && setOpenCash(true)
  }, [cash])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      initial_balance: 0,
      observations: ''
    }
  })

  type FormData = z.infer<typeof formSchema>

  const handleAction = (data: FormData) => {
    if (!cash?.validate) {
      toast.promise(
        createCash({ ...data }).then(() => mutate()),
        {
          loading: 'Abriendo caja...',
          success: () => {
            return 'Caja abierta con éxito'
          },
          error: (err) => {
            return err.message
          }
        }
      )
    }
  }

  const handleClose = () => {
    toast.promise(closeCash().then(() => mutate()), {
      loading: 'Cerrando caja...',
      success: () => {
        setOpen(false)
        return 'Caja cerrada con éxito'
      },
      error: (err) => {
        return err.message
      }
    })
  }

  const handlePrintAndClose = () => {
    setImprimiendo(true)
    setTimeout(() => {
      void handlePrint()
      setTimeout(() => {
        setImprimiendo(false)
        handleClose()
        void mutate()
      }, 500)
    }, 100)
  }

  if (role === 'administrator') {
    return (
      <section className="flex px-4 gap-5 flex-col">
        <Card>
          <CardHeader>
            <CardTitle>
              Bienvenido, {name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mt-1">
              Empieza a gestionar tu negocio desde aquí.
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="flex px-4 gap-5 flex-col">
      {!cash?.validate && <Card>
        <CardHeader>
          <CardTitle>
            Bienvenido, {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mt-1">
            Para comenzar a usar el sistema, debes abrir una caja.
          </p>
          <Button
            onClick={() => setOpenCash(true)}
          >
            Abrir Caja
          </Button>
        </CardContent>
      </Card>}
      {openCash && <div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Apertura de caja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAction)}>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {cash?.validate
                      ? 'Para terminar su turno, debe cerrar la caja.'
                      : 'Ingrese el monto inicial y observaciones para abrir la caja.'}
                  </p>
                  <div className="space-y-4 pt-4">
                    {!cash?.validate && (
                      <div className=''>
                        <FormField
                          control={form.control}
                          name="initial_balance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monto inicial (Bs.)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Monto inicial"
                                  type="number"
                                  value={field.value}
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value))
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="observations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Observaciones</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Observaciones"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {!cash?.validate && <Button
                      type="submit"
                      size="sm"
                      className="w-full"
                      disabled={isMutatingOpen || isMutatingClose}
                    >
                      Abrir caja
                    </Button>}
                  </div>
                </div>
              </form>
            </Form>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  size="sm"
                  className={`w-full ${!cash?.validate ? 'hidden' : ''}`}
                >
                  Cerrar caja
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className='text-lg md:text-xl'>Cerrar caja</DialogTitle>
                  <Label className="text-sm text-muted-foreground">
                    Reumen de operaciones y cierre de caja
                  </Label>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-row justify-between items-center gap-2'>
                    <span className='text-base text-muted-foreground'>
                      Monto inicial:
                    </span>
                    <span className='text-base font-semibold'>
                      Bs. {cashRegister?.initial_balance}
                    </span>
                  </div>

                  <div className='flex flex-row justify-between items-center gap-2'>
                    <span className='text-base text-muted-foreground'>
                      Compras:
                    </span>
                    <span className='text-base font-semibold'>
                      Bs. {cashRegister?.purchases_total}
                    </span>
                  </div>

                  <div className='flex flex-row justify-between items-center gap-2'>
                    <span className='text-base text-muted-foreground'>
                      Total ventas:
                    </span>
                    <span className='text-base font-semibold'>
                      Bs. {cashRegister?.sales_total}
                    </span>
                  </div>

                  <div className='flex flex-row justify-between items-center gap-2 border-t border-t-slate-200 pt-4'>
                    <span className='text-base text-muted-foreground'>
                      Total en caja:
                    </span>
                    <span className='text-base font-semibold'>
                      Bs. {Number(Number(cashRegister?.sales_total) + Number(cashRegister?.initial_balance) - Number(cashRegister?.purchases_total)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    variant='outline'
                    onClick={handleClose}
                    disabled={isMutatingClose}
                  >
                    Cerrar caja
                  </Button>
                  <Button
                    onClick={handlePrintAndClose}
                    disabled={imprimiendo || isMutatingClose}
                  >
                    Imprimir y cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>}
      {cash?.validate &&
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              Empezar vender
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Inicia una nueva venta, selecciona los productos y genera la factura.
            </p>
            <Button
              onClick={() => navigate('/ventas/crear')}
            >
              Vender
            </Button>
          </CardContent>
        </Card>}
      <div style={{ display: 'none' }}>
        <div ref={reporteRef}>
          <ReporteCierre
            montoInicial={Number(cashRegister?.initial_balance)}
            totalVentas={Number(cashRegister?.sales_total)}
            purchases={Number(cashRegister?.purchases_total)}
            totalEfectivo={
              Number(cashRegister?.sales_total) +
              Number(cashRegister?.initial_balance) -
              Number(cashRegister?.purchases_total)
            }
            name={name}
            companyName={AppConfig.APP_TITLE}
            opening_date={cashRegister?.opening.toString()}
            closing_date={new Date().toISOString()}
          />
        </div>
      </div>
    </section>
  )
}

export default DashboardPage

// inicial: 500
// ventas: 1000
// compras: 200
// total: 1000+500-200 = 1300

function ReporteCierre({
  montoInicial,
  totalVentas,
  totalEfectivo,
  name,
  companyName,
  opening_date,
  closing_date,
  purchases
}: {
  montoInicial: number
  totalVentas: number
  totalEfectivo: number
  name?: string
  companyName?: string
  opening_date?: string
  closing_date?: string
  purchases?: number
}) {
  return (
    <div className="p-4 max-w-md mx-auto" style={{ fontFamily: 'monospace' }}>
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{companyName}</h1>
        <h2 className="text-xl font-bold">REPORTE DE CIERRE DE CAJA</h2>
        {/* <p>{formatDate(fecha)}</p> */}
        <p className="text-sm">
          Apertura: {opening_date ? formatDate(new Date(opening_date)) : 'No disponible'}
        </p>
        <p className="text-sm">
          Cierre: {closing_date ? formatDate(new Date(closing_date)) : 'No disponible'}
        </p>
      </div>

      <div className="border-t border-b py-4 my-4">
        <div className="flex justify-between mb-2">
          <span>Monto Inicial:</span>
          <span>Bs. {montoInicial.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Compras:</span>
          <span>Bs. {purchases?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total Ventas:</span>
          <span>Bs. {totalVentas.toFixed(2)}</span>
        </div>
        {/* <div className="flex justify-between mb-2">
          <span>Cantidad de Ventas:</span>
          <span>{cantidadVentas}</span>
        </div> */}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>TOTAL EN CAJA:</span>
            <span>Bs. {totalEfectivo.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <p>
          <strong>Observación:</strong> {'Ninguna'}
        </p>
        <p>
          <strong>Usuario:</strong> {name}
        </p>
        <p className="mt-4 text-center">--- Fin del Reporte ---</p>
      </div>
    </div>
  )
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
