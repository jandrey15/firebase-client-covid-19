import React, { Component } from 'react'
import Loading from './Loading'
import Firebase from '../firebase'

class LoadFile extends Component {
  constructor(props) {
    super(props)
    this.state ={
      file: null,
      urlFile: null,
      message: null,
      loading: false
    }

    this.fileInput = React.createRef()

    this.handleSubmit = this.handleSubmit.bind(this)
    this.firebase = new Firebase()
  }

  handleSubmit(e) {
    e.preventDefault()

    const file = this.fileInput.current.files[0]
    // console.log(file)
    this.setState({
      loading: true
    })

    const task = this.firebase.doStorageRef(file)
    console.log(task)

    task.on('state_changed', (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    }, (error) => {
      console.error(error.message)
      this.setState({
        loading: false,
        message: 'Algo salio mal, intentalo mas tarde.'
      })
    }, () => {
      // Upload complete
      this.setState({
        loading: false,
        message: 'Se cargo el archivo correctamente.'
      })

      task.snapshot.ref.getDownloadURL().then((downloadURL) =>{
        this.setState({
          urlFile: task.snapshot.downloadURL,
        })
        console.log('File available at', downloadURL)
      })
    })
  }

  render() {
    const { user } = this.props
    const { message, loading } = this.state

    if (loading) {
      return <Loading />
    }

    return (
      <section id='LoadFile'>
        <h3>Bienvenido {user.email}</h3>
        <form id='formFile' encType='multipart/form-data' onSubmit={this.handleSubmit}>
          <label htmlFor='file'>Seleccione un archivo .json</label>
          <input id='file' type='file' name='myFile' ref={this.fileInput} required />
          <br />
          <button id='btnLoad' type='submit'>Cargar archivo</button>
        </form>
        {message && <h4 id='message'>{message}</h4>}
      </section>
    )
  }
}

export default LoadFile
