import * as React from 'react';
import * as Radium from 'radium';
import './AppBar.css';

export interface IAppBarProps {
    title: string;
    navigationLinks: () => JSX.Element;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    navigationStyle?: React.CSSProperties;
}

@Radium
export class AppBar extends React.Component<IAppBarProps, {}> {

    constructor(props: IAppBarProps) {
        super(props);
    }

    render(): JSX.Element {
        const {title, navigationLinks, style, titleStyle, navigationStyle} = this.props;
        return (
            <div className='app-bar-container' style={style}>
                <h1 className='title-style' style={titleStyle}>{title}</h1>
                <div className='horizontal-row navigation-style' style={navigationStyle}>
                    {navigationLinks}
                </div>
            </div>
        );
    }
}