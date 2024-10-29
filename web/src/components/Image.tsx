import React from "react";

export default class MyImage extends React.Component<{ src: string, alt: string, width: number, height: number }> {
    img = null;

    componentDidMount = () => {
        if (!this.img) {
            this.img = new Image(this.props.width, this.props.height)

            this.img.onload = () => {
                this.setState({ loaded: true });
            };

            this.img.src = this.props.src;
        }
    };

    render = () => (
        <img hidden={!this.img} src={this.img ? this.img.src : undefined} width={this.props.width} height={this.props.height} alt={this.props.alt} />
    );
}