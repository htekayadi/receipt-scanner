import React from 'react';
import apiClient from '../utils/apiClient';
import { Image, Button, Modal, Input} from 'semantic-ui-react';
const { object, boolean, string } = React.PropTypes;

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      selected: false,
      uploading: false,
      ImageSrc: ''
    };

    this.selectImage = this.selectImage.bind(this);
    this.upload = this.upload.bind(this);
    this.popupClose = this.popupClose.bind(this);
  }

  popupClose() {
    this.setState(Object.assign({}, this.state, { selected: false }));
  }

  upload() {
    if (this.state.file) {
      this.setState(Object.assign({}, this.state, { uploading: true }));

      const data = new FormData();
      data.append('image', this.state.file);

      apiClient(this.props.path, 'post', null, data, null)
      .then((response) => {
        if (!response.data.error) {
          this.setState(Object.assign({}, this.state, { uploading: false, selected: false }));
          this.props.getImageList(response.data.images, response.data.numbers);
        } else {
          alert(response.data.error.message);
          this.setState({
            file: null,
            selected: false,
            uploading: false,
            ImageSrc: ''
          });
        }
      })
      .catch((error) => {
        alert(error.message);
        this.setState({
          file: null,
          selected: false,
          uploading: false,
          ImageSrc: ''
        });
      });
    }
  }

  selectImage(event) {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    const extension = file.name.slice(file.name.lastIndexOf('.'));

    if (extension.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      reader.onloadend = () => {
        this.setState(Object.assign({}, this.state, { ImageSrc: reader.result, file, selected: true }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Only Image files can uploaded!');
    }
  }

  render() {
    return (
            <div style={{ padding: '3.5em 0 3.5em 5em' }}>
              <Input icon="upload" actionPostion="right" onChange={this.selectImage} size="tiny" type="file" teal/>
              <Modal open={this.state.selected} style={{ width: 500, left: '65%' }} >
                <Modal.Content image>
                  <Image wrapped src={this.state.ImageSrc} />
                </Modal.Content>
                <Modal.Actions>
                  <Button content="Cancel" actionPosition="left" onClick={this.popupClose} disabled={this.uploading}/>
                  <Button loading={this.state.uploading} content="Upload" primary actionPostion="right" onClick={this.upload} />
                </Modal.Actions>
              </Modal>
            </div>
            );
  }
}

Upload.PropTypes = {
  file: object,
  selected: boolean,
  uploading: boolean,
  ImageSrc: string
};

