import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ListFilter, MoreHorizontal, PlusCircle, Search, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useDeleteUser, useGetAllUser } from '../../hooks/useUser'
import { type User } from '../../models/user.model'
import { useHeader } from '@/hooks'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'

const UserPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Cajeros' }
  ])
  const navigate = useNavigate()
  const { allUsers, countData, isLoading, mutate, filterOptions, newPage, prevPage, setOffset, search } = useGetAllUser()
  const { deleteUser } = useDeleteUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchProduct, setSearchProduct] = useState('')
  const debounceSearchProduct = useDebounce(searchProduct, 1000)
  const deletePermanentlyUser = (id: string) => {
    toast.promise(deleteUser(id), {
      loading: 'Cargando...',
      success: () => {
        void mutate()
        setTimeout(() => {
          navigate(PrivateRoutes.USER_CREATE, { replace: true })
        }, 1000)
        return 'Cajero eliminado exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Puede que el cajero tenga permisos asignados, por lo que no se puede eliminar'
      }
    })
    setIsDialogOpen(false)
  }

  useEffect(() => {
    search('name', debounceSearchProduct)
  }, [debounceSearchProduct])
  return (
    <section className='grid gap-4 overflow-hidden w-full relative'>
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(-1) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <form className='py-1' onSubmit={(e) => { e.preventDefault() }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar"
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
              onChange={(e) => { setSearchProduct(e.target.value) }}
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='ml-auto'>
            <Button variant="outline" size="sm" className="h-8 gap-1"><ListFilter className="h-3.5 w-3.5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Rol</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <Button size="sm" variant="outline" className="h-8 gap-1"><File className="h-3.5 w-3.5" /></Button> */}
        <Button onClick={() => { navigate(PrivateRoutes.USER_CREATE) }} size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar</span>
        </Button>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Todos los Cajeros</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  {/* <TableHead>Rol</TableHead> */}
                  <TableHead>Estado</TableHead>
                  <TableHead><span className='sr-only'>Opciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={filterOptions.limit} columns={8} />
                  : allUsers?.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      {/* <TableCell>{user.role}</TableCell> */}
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'outline'}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu onOpenChange={() => { setIsDialogOpen(false) }}>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => { navigate(`${PrivateRoutes.USER}/${user.id}`) }}>Editar</DropdownMenuItem>
                            <DropdownMenuItem className='p-0'>
                              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <AlertDialogTrigger asChild className='w-full px-2 py-1.5'>
                                  <div
                                    onClick={(event) => { event.stopPropagation() }}
                                    className={`${user.is_active ? 'text-danger' : ''} flex items-center`}
                                  >
                                    {user.is_active
                                      ? <><Trash className="mr-2 h-4 w-4" />Eliminar</>
                                      : 'Activar'}
                                  </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{user.is_active ? 'Eliminar cajero' : 'Activar cajero'}</AlertDialogTitle>
                                  </AlertDialogHeader>
                                  {user.is_active
                                    ? <>
                                      <AlertDialogDescription>Esta acción eliminará el cajero, no se puede deshacer.</AlertDialogDescription>
                                      <AlertDialogDescription>¿Estás seguro que deseas continuar?</AlertDialogDescription>
                                    </>
                                    : <AlertDialogDescription>
                                      Para activar el ajero deberá contactarse con un administrador del sistema.
                                    </AlertDialogDescription>
                                  }
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className='h-fit'>Cancelar</AlertDialogCancel>
                                    {user.is_active &&
                                      <AlertDialogAction className='h-full' onClick={() => { deletePermanentlyUser(user.id) }}>
                                        Continuar
                                      </AlertDialogAction>}
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allUsers?.length ?? 0}
            limit={filterOptions.limit}
            newPage={() => { newPage(countData ?? 0) }}
            offset={filterOptions.offset}
            prevPage={prevPage}
            setOffset={setOffset}
            setLimit={() => { }}
            params={true}
          />
        </CardFooter>
      </Card>
    </section>
  )
}

export default UserPage
