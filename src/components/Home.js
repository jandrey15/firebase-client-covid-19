import React, { Component } from 'react'
import LoadFile from './LoadFile'
import Firebase from '../firebase'
import { Button, Container, Form, Grid, Segment, Message } from 'semantic-ui-react'
import Loading from './Loading'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: null,
      errorMessage: null,
      loading: true,
      user: false,
      userData: ''
    }
    this.firebase = new Firebase()
  }

  componentDidMount () {
    this.fireBaseListener = this.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        // user está logueado.
        this.setState({
          loading: false,
          user: true,
          userData: user
        })
      } else {
        console.info('Iniciar sesión')
        this.setState({
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.fireBaseListener && this.fireBaseListener()
  }

  onSubmit = event => {
    const { email, password } = this.state

    this.firebase
      .doAutEmailPass(email, password)
      .then((result) => {
        this.setState({ ...this.state })
        if (result.user.emailVerified) {
          console.info(`Bienvenido ${result.user.email}`)
        } else {
          console.warn('Por favor realiza la verificación de la cuenta')
          const user = this.firebase.doCurrentUser()

          user.sendEmailVerification().then(() => {
            console.log('Se envío el correo')
          }).catch((error) => {
            console.error('Algo salio mal -> ', error)
          })
          // Cierra la sesión
          this.firebase.doSignOut()
        }
      })
      .catch(error => {
        console.error(error)
        // Si pasa algo o esta mal el pass.
        this.setState({
          errorMessage: 'La contraseña no es válida o el usuario no tiene una contraseña.',
          error
        })
      })

    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    const { email, password, error, errorMessage, loading, user, userData } = this.state

    const isInvalid = password === '' || email === ''
    // console.log(isInvalid)
    if (loading) {
      return <Loading />
    }

    if (user) {
      return <LoadFile user={userData} />
    }

    return (
      <section id='Login'>
        <Container>
          <Segment placeholder>
            <Grid relaxed='very' stackable>
              <Grid.Column>
                <Form onSubmit={this.onSubmit}>
                  <Form.Input icon='user' iconPosition='left' label='Username' name='email'
                    value={email}
                    onChange={this.onChange}
                    type='text'
                    placeholder='Correo electrónico' error={error} />
                  <Form.Input icon='lock' iconPosition='left' label='Password'name='password'
                    value={password}
                    onChange={this.onChange}
                    type='password'
                    placeholder='Contraseña' error={error} />

                  <Button content='Iniciar sesión' primary disabled={isInvalid} />

                </Form>
              </Grid.Column>
            </Grid>
          </Segment>
          {error && (
            <Message negative>
              <Message.Header>{errorMessage}</Message.Header>
              <p>Comuniquese con el administrador</p>
            </Message>
          )}
        </Container>
      </section>
    )
  }
}

export default Home