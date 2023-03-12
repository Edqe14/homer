import type { ReactNode } from 'react';
import { Link, StackOverflowLogo, YoutubeLogo } from '@phosphor-icons/react';
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

const Configuration = new GetSet({
  clock: {
    format: '12' as '12' | '24',
    showSeconds: false,
  },
  search: {
    url: 'https://duckduckgo.com',
    macros: [
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
        key: 'go',
        name: 'Go To',
        icon: <Link size={20} weight="bold" />,
        action({ query }) {
          goTo(query);
        },
        autoComplete({ query }) {
          return [
            {
              key: 'gpt',
              name: 'ChatGPT',
              action() {
                goTo('https://chat.openai.com');
              },
            },
          ].filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));
        },
        style: {
          background: '#fefefe',
          text: '#0e0e0e',
        },
      },
    ] satisfies Macro[],
  },
  links: [
    {
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
          className="w-20"
        />
      ),
    },
  ] satisfies Link[],
} as const);

export default Configuration;
