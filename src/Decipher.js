import React from 'react';

export default class Decipher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedEncipheredText: "",
            previousEncTxtInput: null,
            previousKeyInput: null,
            decodeKey: {},
            decipheredText: "",
            decodeRef: '#',
            keyGenDisabled: true,
            encodeBtnDisabled: true,
            saveFileBtnDisabled: true,
            saveKeyBtnDisabled: true,
            decodeBtnDisabled: true,
            saveDecodedBtnDisabled: true
        };
        this.handleDecode = this.handleDecode.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.toBinary = this.toBinary.bind(this);
        this.fromBinary = this.fromBinary.bind(this);
        this.keyEndingCheck = this.keyEndingCheck.bind(this);
    }

    handleDecode() {
        const TYPE = 'data:application/octet-stream;base64, ';
        let encipheredFile = document.getElementById('load-en').files[0];
        let keyFile = document.getElementById('load-en-key').files[0];
        const nonKeyWordChars = [' ', ',', '.', '<', '>', '/', '|', '\\', '[', ']',
 '{', '}', '!', '@', '"', '\'', '#', '№', '$', ';', '%', '^', ':', '&', '?',
 '*', '(', ')', '~', '`', '+', '-', '_', '=', '↵', '\n', '\t', '\r'];
        let decipheredText = "";
        console.log(encipheredFile);
        let textPromise = new Promise((resolve, reject) => {
            let reader = new FileReader();
            if (encipheredFile !== this.state.previousEncTxtInput) {
                reader.onload = () => {
                    if (reader.result) {
                        this.setState({
                            loadedEncipheredText: this.fromBinary(reader.result)
                        });
                        console.log(reader.result);
                        resolve(reader.result);
                    }
                };
                reader.readAsText(encipheredFile);
            }
            else {
                resolve(this.state.loadedEncipheredText);
            }
        });
        let promiseThis = this;
        textPromise.then(result => {
            if (result) {
                console.log(result);
                let keyPromise = new Promise((resolve, reject) => {
                    let keyReader = new FileReader();
                    if (keyFile !== promiseThis.state.previousKeyInput) {
                        promiseThis.setState({
                            decodeKey: {}
                        });
                        keyReader.onload = () => {
                            if(keyReader.result) {
                                console.log(keyReader.result);
                                resolve(promiseThis.fromBinary(keyReader.result));
                            }
                        };
                        keyReader.readAsText(keyFile)
                    }
                });
                keyPromise.then(result => {
                    if (result) {
                        promiseThis.setState({
                            decodeKey: JSON.parse(result)
                        })
                        console.log(promiseThis.state.decodeKey);
                    }
                    promiseThis.setState({
                        previousKeyInput: keyFile,
                        decipheredText: ""
                    });
                    console.log(promiseThis.state.loadedEncipheredText);
                    for (let j = 0; j < promiseThis.state.loadedEncipheredText.length; j++) {
                        if (nonKeyWordChars.indexOf(promiseThis.state.loadedEncipheredText[j]) !== -1) {
                            decipheredText += promiseThis.state.loadedEncipheredText[j];
                        }
                        else {
                            for (let i = 0; i < promiseThis.state.decodeKey.key.length; i++) {
                                if (promiseThis.state.decodeKey.key[i].indexOf(promiseThis.state.loadedEncipheredText[j]) !== -1
                                && i !== 0) {
                                    decipheredText = decipheredText + 
                                    promiseThis.state.decodeKey.key[i - 1][promiseThis.state.decodeKey.key[i]
                                    .indexOf(promiseThis.state.loadedEncipheredText[j])];
                                }
                                else if (promiseThis.state.decodeKey.key[i].indexOf(promiseThis.state.loadedEncipheredText[j]) !== -1
                                && i === 0
                                && promiseThis.keyEndingCheck(promiseThis.state.decodeKey.key) === -1) {
                                    decipheredText = decipheredText + 
                                    promiseThis.state.decodeKey.key[promiseThis.state.decodeKey.key.length - 1][promiseThis.state.decodeKey.key[i]
                                    .indexOf(promiseThis.state.loadedEncipheredText[j])];
                                }
                                else if (promiseThis.state.decodeKey.key[i].indexOf(promiseThis.state.loadedEncipheredText[j]) !== -1
                                && i === 0 && promiseThis.keyEndingCheck(promiseThis.state.decodeKey.key) !== -1
                                && promiseThis.state.decodeKey.key.length > 2) {
                                    decipheredText = decipheredText + 
                                    promiseThis.state.decodeKey.key[promiseThis.state.decodeKey.key.length - 2][promiseThis.state.decodeKey.key[i]
                                    .indexOf(promiseThis.state.loadedEncipheredText[j])];
                                }
                            }
                        }
                    }
                    promiseThis.setState({
                        decipheredText: decipheredText
                    });
                    if (promiseThis.state.decipheredText) {
                        let binaryDecoded = promiseThis.toBinary(promiseThis.state.decipheredText)
                        promiseThis.setState({
                            decodeRef: TYPE + btoa(binaryDecoded),
                            saveDecodedBtnDisabled: false
                        });
                        console.log(promiseThis.state.decipheredText);
                    }
                }, error => alert(error));
            }
            promiseThis.setState({
                previousEncTxtInput: encipheredFile
            })
        }, error => alert(error));
    }

    handleFileInput (e) {
        const KEYGEN_INPUT = document.getElementById('keygen-input');
        if (e.target.id === 'load-dec') {
            console.log(e.target.value);
            e.target.value !== "" ? this.setState({keyGenDisabled: false}) : this.setState({keyGenDisabled: true});
            if (!e.target.value) {
                this.setState({
                    encodeBtnDisabled: true,
                    saveFileBtnDisabled: true,
                    saveKeyBtnDisabled: true,
                });
                KEYGEN_INPUT.readOnly = false;
                KEYGEN_INPUT.value = "";
                KEYGEN_INPUT.readOnly = true;
            }
        }
        else {
            (document.getElementById('load-en').value !== ""
             && document.getElementById('load-en-key').value !== "") ?
              this.setState({decodeBtnDisabled: false}) : this.setState({decodeBtnDisabled: true});
            if (!e.target.value) {
                this.setState({
                    decodeBtnDisabled: true,
                    saveDecodedBtnDisabled: true
                });
            }
        }
    }

    toBinary(string) {
        const codeUnits = new Uint16Array(string.length);
        for (let i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = string.charCodeAt(i);
        }
        return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
    }

    fromBinary(binary) {
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return String.fromCharCode(...new Uint16Array(bytes.buffer));
    }

    keyEndingCheck(key) {
        return key[key.length - 1].indexOf(null);
    }

    render() {
        return (
            <React.Fragment>
                <div className="enciphered-uploading">
                    <p>Загрузите файл, который Вы хотите расшифровать:</p>
                    <input id="load-en" type="file" onInput={this.handleFileInput} />
                </div>
                <div className="deciphering-key-uploading">
                    <p>Загрузите файл ключа дешифрования:</p>
                    <input id="load-en-key" type="file" onInput={this.handleFileInput} />
                </div>
                <div className="decipher">
                    <p>Чтобы расшифровать файл по загруженному ключу, нажмите на кнопку:</p>
                    <input type="button" id="decode-button" value="Расшифровать" onClick={this.handleDecode} disabled={this.state.decodeBtnDisabled} />
                </div>
                <div className="process-indicator" id="decode-progress">decoding...</div>
                <div className="plain-downloading">
                    <a id="deciphered-txt-link" download="deciphered.txt" href={this.state.decodeRef} >
                        <input type="button" id="download-decoded" value="Скачать расшифрованный файл" disabled={this.state.saveDecodedBtnDisabled} />
                    </a>
                </div> 
            </React.Fragment>
        );
    }
}