import type { ReactNode } from 'react';
import {
  DevToLogo,
  GithubLogo,
  Link,
  NotionLogo,
  SpotifyLogo,
  StackOverflowLogo,
  TwitchLogo,
  WhatsappLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';
import GetSet from './lib/getSet';
import goTo from './lib/goTo';

export interface ActionOptions {
  query: string;
  setSearch: (value: string) => void;
  // eslint-disable-next-line no-use-before-define
  setMacro: (value: Macro | null) => void;
}

export interface Macro {
  key: string;
  name: string;
  icon?: ReactNode;
  action: (options: ActionOptions) => void;
  autoComplete?: (
    options: Omit<ActionOptions, 'setMacro'>
  ) => Omit<Macro, 'autoComplete'>[];
  style?: {
    background?: string;
    text?: string;
  };
}

export interface Link {
  name: string;
  url: string;
  icon?: ReactNode;
}

const Links = [
  {
    key: 'gpt',
    name: 'ChatGPT',
    icon: <img src="/images/openai.png" alt="" width={20} height={20} />,
    action() {
      goTo('https://chat.openai.com');
    },
    style: {
      background: '#74aa9c',
    },
  },
  {
    key: 'dev',
    name: 'Dev.to',
    icon: <DevToLogo size={20} />,
    action() {
      goTo('https://dev.to');
    },
    style: {
      background: '#0e0e0e',
    },
  },
  {
    key: 'notion',
    name: 'Notion',
    icon: <NotionLogo size={20} weight="fill" />,
    action() {
      goTo('https://notion.so');
    },
    style: {
      background: '#fefefe',
      text: '#0e0e0e',
    },
  },
  {
    key: 'github',
    name: 'Github',
    icon: <GithubLogo size={20} weight="fill" />,
    action() {
      goTo('https://notion.so');
    },
    style: {
      background: '#0e0e0e',
      text: '#fefefe',
    },
  },
  {
    key: 'whatsapp',
    name: 'Whatsapp',
    icon: <WhatsappLogo size={20} weight="fill" />,
    action() {
      goTo('https://web.whatsapp.com/');
    },
    style: {
      background: '#189d0e',
      text: '#fefefe',
    },
  },
  {
    key: 'spotify',
    name: 'Spotify',
    icon: <SpotifyLogo size={20} weight="fill" />,
    action() {
      goTo('https://spotify.com');
    },
    style: {
      background: '#0e0e0e',
      text: '#23cf5f',
    },
  },
  {
    key: 'discord',
    name: 'Discord',
    icon: <img src="/images/discord.png" alt="" width={20} height={20} />,
    action() {
      goTo('https://discord.com');
    },
    style: {
      background: '#fefefe',
    },
  },
  {
    key: 'twitch',
    name: 'Twitch',
    icon: <TwitchLogo size={20} weight="fill" />,
    action() {
      goTo('https://twitch.com');
    },
    style: {
      background: '#6441a5',
    },
  },
] satisfies ReturnType<NonNullable<Macro['autoComplete']>>;

const Configuration = new GetSet({
  clock: {
    format: '12' as '12' | '24',
    showSeconds: false,
  },
  search: {
    url: 'https://duckduckgo.com',
    macros: [
      {
        key: 'go',
        name: 'Go To',
        icon: <Link size={20} weight="bold" />,
        action({ query }) {
          goTo(query);
        },
        autoComplete({ query }) {
          return Links.filter((m) =>
            m.name.toLowerCase().includes(query.toLowerCase())
          );
        },
        style: {
          background: '#fefefe',
          text: '#0e0e0e',
        },
      },
      {
        key: 'yt',
        name: 'Youtube',
        icon: <YoutubeLogo size={20} weight="fill" />,
        action({ query }) {
          goTo('https://www.youtube.com/results', {
            search_query: query,
          });
        },
        style: {
          background: '#f43633',
        },
      },
      {
        key: 'gh',
        name: 'Github',
        icon: <GithubLogo size={20} weight="fill" />,
        action({ query }) {
          goTo('https://github.com/search', {
            q: query,
            type: 'repository',
          });
        },
        style: {
          background: '#fefefe',
          text: '#0e0e0e',
        },
      },
      {
        key: 'so',
        name: 'Stack Overflow',
        icon: <StackOverflowLogo size={20} weight="bold" />,
        action({ query }) {
          goTo('https://stackoverflow.com/search', {
            q: query,
          });
        },
        style: {
          background: '#f7912c',
        },
      },
    ] satisfies Macro[],
  },
} as const);

export default Configuration;
