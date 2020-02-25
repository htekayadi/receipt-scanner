import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
const { array } = React.PropTypes;

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {  
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    this.setState({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
    this.props.numbers.forEach(number => {
      if(x >= number.vertices[0].x && x <= number.vertices[1].x && y >= number.vertices[0].y && y <= number.vertices[2].y) {
        window.confirm(number.number);
        return;
      }
    })
  }

  render() {
    const imageUrl = this.props.imageUrls[0] ? this.props.imageUrls[0].url : ''
    return (
      <div>
        <Grid container divided streched centered>
        <div className="previewComponent">
                <div className="imgPreview">
                    <img src={imageUrl} alt="" onClick={this.handleClick}/>
                </div>
            </div>
        </Grid>
      </div>
    );
  }
}

Preview.PropTypes = {
  imageUrls: array
};
