import React from 'react';
const { func } = React.PropTypes;


export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaded: false
    };
  }

  render() {
    return (
     <div>
     </div>
     );
  }
}

Footer.PropTypes = {
  getImageList: func
};
