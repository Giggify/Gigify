import React from 'react'
import {connect} from 'react-redux'
import Modal from 'simple-react-modal'
import Loading from 'react-loading'

class Playlist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlistID: props.playlistID,
      playlistLoading: props.playlistLoading,
      isShowingModal: false
    }
  }
  componentWillReceiveProps({playlistLoading, playlistID}) {
    if (playlistID != this.state.playlistID) {
      this.setState({isShowingModal: true})
    }
    this.setState({playlistLoading, playlistID})
  }

  closeModal = () => this.setState({isShowingModal: false})


 render() {
   const {playlistLoading, playlistID, isShowingModal} = this.state
   let playListContent
   if(playlistLoading && !playlistID) {
       playListContent =
       <div className="Loading">
            <Loading type='bars' color='#ff6900' height='500px' width='400px'/>
       </div>;
    } else if (!playlistLoading && playlistID) {
       playListContent =
       <div className="Playlist">
             <Modal
               show={isShowingModal}
               onClose={() => this.closeModal.bind(this)}
               style={{width: "100%"}}
               containerStyle={{background: 'none'}}
               closeOnOuterClick={true}
               >
               <div style={{width: '100%'}} className="inner-modal">
                 <p style={{width: '100%', marginLeft: '25vh', fontSize: '25px', color:'#ff6900'}} onClick={() => this.closeModal()} >&#10007;</p>
                 <iframe src={`https://open.spotify.com/embed/user/${this.props.user}/playlist/${this.props.playlistID}`} width="380px" height="450px" frameBorder="0" allowTransparency="false"></iframe>
               </div>
             </Modal>
       </div>;
    } else {
       playListContent = <div/>;
    }
    return (
      <div>
        {playListContent}
      </div>
    )


 }
}

const mapStateToProps  = (state)  => {
  return {
    playlistLoading: state.playlist.playlistLoading,
    error: state.error,
    playlistID: state.playlist.playlistID,
    user: state.users.user
  }
}
export default connect(mapStateToProps)(Playlist)
