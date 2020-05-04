import React from 'react';
import Text from '../controls/custom-text';
import Bold from './bold';
import Italic from './italic';
import Link from './link';
import routes from '../routes/routes';

let counter = 0;

function a(text, url, style) {
    if (!url) {
        console.error(`tag-handlers.js: bad ${text} link`);
        return text;
    }
    if (url.link.startsWith('route:')) {
        const [, type, route] = url.link.split(':');
        const action = () => {
            if (url.tracker) url.tracker();
            routes[type][route]();
        };
        if (action)
            return (
                <Link key={text} onPress={action} style={style}>
                    {text}
                </Link>
            );
    }
    return (
        <Link key={url.link} url={url} style={style}>
            {text}
        </Link>
    );
}

function b(text) {
    return <Bold key={text}>{text}</Bold>;
}

function i(text) {
    return <Italic key={text}>{text}</Italic>;
}

function br() {
    return <Text key={counter++}>{'\n'}</Text>;
}

module.exports = {
    a,
    b,
    i,
    br
};
