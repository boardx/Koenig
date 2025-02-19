import {generateDecoratorNode} from '../../generate-decorator-node';
import {parseCodeBlockNode} from './CodeBlockParser';
import {renderCodeBlockNode} from './CodeBlockRenderer';

export class CodeBlockNode extends generateDecoratorNode({nodeType: 'codeblock',
    properties: [
        {name: 'code', default: '', wordCount: true},
        {name: 'language', default: ''},
        {name: 'caption', default: '', urlType: 'html', wordCount: true}
    ]}
) {
    static importDOM() {
        return parseCodeBlockNode(this);
    }

    exportDOM(options = {}) {
        return renderCodeBlockNode(this, options);
    }

    isEmpty() {
        return !this.__code;
    }
}

export function $createCodeBlockNode(dataset) {
    return new CodeBlockNode(dataset);
}

export function $isCodeBlockNode(node) {
    return node instanceof CodeBlockNode;
}
