import React, { Component } from 'react';
import styles from './styles.css';

import imageRed from '../../assets/images/red-app.png';
import imageBlue from '../../assets/images/blue-app.png';
import logo from '../../assets/icons/logo-red.svg';
import appStoreButton from '../../assets/images/apple-store.png';
import googlePlayButton from '../../assets/images/google-play.png';

class HomePage extends Component {
  render() {
    return (
      <div className="container">
        <div className={styles.HomePage}>
          <div className={styles.HomePage__images}>
            <div className={styles.HomePage__images__container_red}>
              <img
                alt="Red app on device"
                src={imageRed}
                className={styles.HomePage__images__image_red}
              />
            </div>
            <div className={styles.HomePage__images__container_blue}>
              <img
                alt="Blue app on device"
                src={imageBlue}
                className={styles.HomePage__images__image_blue}
              />
            </div>
          </div>
          <div className={styles.HomePage__description}>
            <h1 className={styles.HomePage__header}>
              Offerbrite
          </h1>
            <h4 className={styles.HomePage__subheader}>Buy cheaper</h4>
            <div className={styles.HomePage__content}>
              <div className={styles.HomePage__logo__container}>
                <img
                  alt="Offerbrite logo"
                  src={logo}
                  className={styles.HomePage__logo__image}
                />
              </div>
              <div className={styles.HomePage__links__container}>
                <a href="" className={styles.HomePage__link}>
                  <img
                    alt="Google Play Store"
                    src={appStoreButton}
                    className={styles.HomePage__link_google}
                  />
                </a>
                <a href="" className={styles.HomePage__link}>
                  <img
                    alt="Apple Store"
                    src={googlePlayButton}
                    className={styles.HomePage__link_apple}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
