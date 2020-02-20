import React from 'react';
import Footer from './Footer';
import Upload from './Upload';
import Preview from './Preview';
import { Header, Image } from 'semantic-ui-react';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageUrls: []};
    this.getImageList = this.getImageList.bind(this);
  }

  getImageList(imageUrls) {
    this.setState({
      imageUrls
    });
  }

  render() {
    return (
      <div>
        <Header as="h1" block style={{ background: '#ffffff' }}>
          <Image style={{ width: '5em' }} shape="circular" src="https://www.innovo42.com/InnovoPublicResources/img/logo_header.png?1852"/>
        </Header>
        <Upload path="/upload" getImageList={this.getImageList }/>
        <Preview imageUrls={this.state.imageUrls}/>

        <Footer />
      </div>
    );
  }
}
