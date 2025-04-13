import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks'
import { AppConfig } from '@/config'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import { authStatus } from '@/utils'
import Loading from '@/components/shared/loading'

const LoginPage = (): JSX.Element => {
  const { isMutating, error, signWithGoogle, status } = useAuth()

  const googleLoginFn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      void signWithGoogle(tokenResponse?.access_token)
    },
    onError: (errorResponse: any) => { console.log(errorResponse) }
  })

  return (
    <div className="w-full min-h-[100dvh] grid lg:min-h-[100dvh]">
      <div className="flex items-center justify-center py-12 z-10 md:grid md:grid-cols-2 md:max-w-screen-lg md:mx-auto">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">{AppConfig.APP_TITLE}</h1>
            <p className="text-balance text-muted-foreground">
              Inicia sesión para acceder a tus proyectos de diseño
            </p>
          </div>
          <div className="grid gap-4">
            {error && <div className="text-red-500 text-center">{error}</div>}
            {/* <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <>
                      <div className="grid gap-2">
                        <FormItem>
                          <FormLabel>Correo electronico</FormLabel>
                          <FormControl>
                            <Input id="email"
                              type="email"
                              placeholder="ejemplo@gmail.com"
                              required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    </>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <>
                      <div className="grid gap-2">
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input id="password" type="password" required placeholder='********' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    </>
                  )}
                />
                <Button type="submit" disabled={isMutating} className="w-full mt-4">
                  {isMutating ? <Loading /> : 'Iniciar sesión'}
                </Button>
              </form>
            </Form> */}
          </div>
          <div>
            <Button
              className='w-fit mx-auto bg-white text-black hover:bg-gray-100 border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 px-8'
              onClick={() => { googleLoginFn() }}
              disabled={isMutating}
            >
              {status === authStatus.loading
                ? <Loading />
                : <>
                  <FcGoogle size={28} />
                  Iniciar sesión con Google
                </>
              }
            </Button>
          </div>
        </div>
        <div className="hidden md:flex w-full h-full items-center justify-end relative">
          <div className='bg-white rounded-full aspect-square w-[80%] absolute inset-0 my-auto mx-auto blur-3xl opacity-15'></div>
          <img
            src="/images/inspiration.png"
            alt="fuel station"
            className="h-[50%] w-full object-contain mb-0 z-0 md:h-[70%]"
          />
        </div>
      </div>
      {/* <div className="hidden bg-muted md:flex w-full h-full items-end justify-end absolute right-0 top-0 bottom-0 z-0">
        <img
          src="/images/inspiration.png"
          alt="fuel station"
          className="h-[50%] w-fit object-contain mb-0 z-0"
        />
      </div> */}
    </div >
  )
}

export default LoginPage
