import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';


import styles from './friends.module.css';

const FriendList = [
    {
        "avatar": "https://pic1.imgdb.cn/item/65c1c9269f345e8d03080e8d.jpg",
        "link": "https://www.duskydream.icu/",
        "name": "Shepherd"
    },
]

function FriendCard({avatar, link, name}) {
    return (
        <div className={clsx('col col--4', styles.cell)}>
            <div className={link ? styles.card : styles.card_shadow}>
                <a href={link ? link : undefined}>
                    <div className={styles["friend-ship"]}>
                        <img src={avatar ? avatar : "./img/no-avatar.svg"} height="100" width="100"/>
                        <div>
                            <h1>{name}</h1>
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