import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';


import styles from './friends.module.css';

const FriendList = [
    {
        "avatar": "/img/friends/65c1c9269f345e8d03080e8d.jpg",
        "link": "https://www.duskydream.icu/",
        "name": "Shepherd",
        "description": ""
    },
    {
        "avatar": "/img/friends/yuricamp.jpg",
        "link": "https://blog.fw190.top/",
        "name": "Fw190",
        "description": ""
    },
    {
        "avatar": "/img/friends/90621.png",
        "link": "https://jboyxs.775772.xyz/",
        "name": "jboyxs",
        "description": "Real NU主席"
    },
]

function FriendCard({avatar, link, name, description}) {
    return (
        <div className={clsx('col col--4', styles.cell)}>
            <div className={link ? styles.card : styles.card_shadow}>
                {/* 添加 target="_blank" 实现新窗口打开 */}
                {/* 添加 rel="noopener noreferrer" 是为了安全性 */}
                <a 
                    href={link ? link : undefined} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <div className={styles["friend-ship"]}>
                        <img src={avatar ? avatar : "./img/no-avatar.svg"} height="100" width="100"/>
                        <div>
                            <h1>{name}</h1>
                            {description && <p className={styles.friendDescription}>{description}</p>}
                        </div>
                    </div>
                </a>
            </div>
        </div>
      );
}

function AllFriends() {
    return (
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FriendList.filter((props) => !props.no_back_edge).sort(() => Math.random() - 0.5).map((props, idx) => (
                <FriendCard key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      );
}


export default function Friends() {
    const {siteConfig} = useDocusaurusContext();
    return (
      <Layout
        title="Rock's Friends">
        <AllFriends />
      </Layout>
    );
  }