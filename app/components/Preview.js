import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
const { array } = React.PropTypes;

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const imageList = [];
    this.props.imageUrls.forEach((image) => {
      imageList.push(<Image as="a" src={image.url} size="medium" target="_blank" href={image.url} />);
    });

    return (
      <div>
        <Grid container divided streched centered>
          <Image.Group>
            { imageList }
          </Image.Group>
        </Grid>
      </div>
    );
  }
}

Preview.PropTypes = {
  imageUrls: array
};
