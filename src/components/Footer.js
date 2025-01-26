import React from 'react';
import './Footer.css'; // 스타일이 필요하면 이 파일을 추가하세요.

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-bottom">
                <div className="container">
                    <div className="inner">
                        <div className="row">
                            <div className="col-12">
                                <div className="content">
                                    <p className="copyright-text">
                                        Developed by Elice Cloud 4기 3차 프로젝트 2팀  <a href="https://www.notion.so/elice-track/13d2bb984257807e8f96fbd2d4aaadcf" rel="nofollow"
                                                                     target="_blank">MOSOO</a>
                                    </p>
                                    <ul className="footer-social">
                                        <li><a href="https://github.com/orgs/MOSOO-team/repositories" target="_blank"><i className="lni lni-github-original"></i></a></li>
                                        <li><a href="https://www.figma.com/design/tO8TessD61cVOMxqG1zISC/2%ED%8C%80?node-id=0-1&node-type=canvas&t=uMT6HtyR0lMDuXt8-0" target="_blank"><i className="lni lni-figma"></i></a></li>
                                        <li><a href="https://www.erdcloud.com/d/gcsZ8ddaLww3rdCrt" target="_blank"><i className="lni lni-database"></i></a></li>
                                        <li><a href={`https://5p3xdi7420.execute-api.ap-northeast-2.amazonaws.com/swagger-ui/index.html`} target="_blank"><i className="lni lni-shortcode"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
