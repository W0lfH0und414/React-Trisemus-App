import React from 'react';

export default class Encipher extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alphabet: [],
            keyChars: [],
            previousFileInput: null,
            plainText: "",
            keyWord: "",
            keyReference: '#',
            resultReference: '#',
            keyGenDisabled: true,
            encodeBtnDisabled: true,
            saveFileBtnDisabled: true,
            saveKeyBtnDisabled: true,
            decodeBtnDisabled: true,
            saveDecodedBtnDisabled: true
        };
        
        this.handleFileInput = this.handleFileInput.bind(this);
        this.handleKeyGen = this.handleKeyGen.bind(this);
        this.handleEncode = this.handleEncode.bind(this);
        this.toBinary = this.toBinary.bind(this);
        this.fromBinary = this.fromBinary.bind(this);
    }

    handleKeyGen() {
        const PLAIN_TEXT_FILE_INPUT = document.getElementById('load-dec');
        const KEYGEN_INPUT = document.getElementById('keygen-input');
        const nonKeyWordChars = [' ', ',', '.', '<', '>', '/', '|', '\\', '[', ']',
 '{', '}', '!', '@', '"', '\'', '#', '№', '$', ';', '%', '^', ':', '&', '?',
 '*', '(', ')', '~', '`', '+', '-', '_', '=', '↵', '\n', '\t', '\r'];
        let file = PLAIN_TEXT_FILE_INPUT.files[0];
        let alphabet = [];
        let keyChars = [];
        let keyLen = 0;
        let keyWord = "";
        let promiseThis = this;
        if (file) {
            let promise = new Promise(function(resolve, reject) {
                let reader = new FileReader();
                if (file !== promiseThis.state.previousFileInput) {
                    promiseThis.setState({
                        plainText: ""
                    });
                    reader.onload = function() {
                        if (reader.result) {
                            promiseThis.setState({
                                plainText: reader.result
                            });
                            console.log(reader.result);
                            for (let i = 0; i < reader.result.length; i++) {
                                if (alphabet.indexOf(reader.result[i]) === -1) {
                                    alphabet.push(reader.result[i]);
                                }
                            }
                            keyChars = alphabet.filter(ch => nonKeyWordChars.indexOf(ch) === -1)
                            console.log(keyChars);
                            promiseThis.setState({
                                alphabet: alphabet,
                                keyChars: keyChars
                            });
                            resolve(keyChars);
                        }
                    }
                    reader.readAsText(file);
                }
                else {
                    resolve(promiseThis.state.keyChars);
                }
            });
            promise.then(result => {
                if(result) {
                    console.log(result);
                    if (promiseThis.state.keyChars) {
                        if (promiseThis.state.keyChars.length > 15) {
                            keyLen = Math.round(Math.random()*3) + 5;
                        } 
                        else {
                            keyLen = Math.round(Math.random()*4);
                        }
                        console.log(keyLen);
                        let keyChar = '';
                        while (keyWord.length < keyLen) {
                            keyChar = promiseThis.state.keyChars[Math.round(Math.random()*promiseThis.state.keyChars.length) - 1];
                            if (keyChar && keyChar !== '↵' && keyWord.indexOf(keyChar) === -1){
                                keyWord += keyChar;
                            }
                        }
                        promiseThis.setState({
                            keyWord: keyWord
                        });
                        console.log(keyWord);
                        if (KEYGEN_INPUT.value) {
                            promiseThis.setState({encodeBtnDisabled: false});
                        }
                    }
                }
                else {
                    KEYGEN_INPUT.readOnly = false;
                    KEYGEN_INPUT.value = "";
                    KEYGEN_INPUT.readOnly = true;
                }
                promiseThis.setState({
                    previousFileInput: file
                });
            }, error => alert(error));
        }
        else {return;}
    }

    handleFileInput (e) {
        const KEYGEN_INPUT = document.getElementById('keygen-input');
        if (e.target.id === 'load-dec') {
            console.log(e.target.value);
            e.target.value !== "" ? this.setState({disabled: false}) : this.setState({disabled: true});
            if (!e.target.value) {
            this.setState({encodeBtnDisabled: true,
            saveFileBtnDisabled: true,
            saveKeyBtnDisabled: true});
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

    handleEncode () {
        const TYPE = 'data:application/octet-stream;base64, ';
        let key = [];
        let keyCols = this.state.keyWord.length;
        let keyRows = Math.ceil(this.state.keyChars.length/keyCols);
        let keyCharsIndexer = 0;
        for (let i = 0; i < keyRows; i++) {
            key[i] = [];
            for (let j = 0; j < keyCols; j++) {
                if (i === 0) {
                    key[i][j] = this.state.keyWord[j];
                }
                else {
                    while (this.state.keyWord.indexOf(this.state.keyChars[keyCharsIndexer]) !== -1) {
                        keyCharsIndexer++;
                    }
                    if (keyCharsIndexer < this.state.keyChars.length) {
                        key[i][j] = this.state.keyChars[keyCharsIndexer];
                    }
                    else {
                        key[i][j] = null;
                    }
                    keyCharsIndexer++;
                }
            }
        }
        console.log(key);
        if (key) {
            let encipheredText = "";
            for (let i = 0; i < this.state.plainText.length; i++) {
                if (this.state.keyChars.indexOf(this.state.plainText[i]) === -1) {
                    encipheredText += this.state.plainText[i];
                }
                else {
                    for (let j = 0; j < key.length; j++) {
                        if (key[j].indexOf(this.state.plainText[i]) !== -1 &&
                        j !== key.length - 1 &&
                        key[j + 1][key[j].indexOf(this.state.plainText[i])] !== null) {
                            encipheredText += key[j + 1][key[j].indexOf(this.state.plainText[i])];
                        }
                        else if (key[j].indexOf(this.state.plainText[i]) !== -1 && j === key.length - 1) {
                            encipheredText += key[0][key[j].indexOf(this.state.plainText[i])];
                        }
                        else if (j !== key.length - 1 && key[j + 1][key[j].indexOf(this.state.plainText[i])] === null) {
                            encipheredText += key[0][key[j].indexOf(this.state.plainText[i])];
                        }
                    }
                }  
            }
            console.log(encipheredText);
            console.log(this.toBinary(encipheredText));
            console.log(this.fromBinary(encipheredText));
            let converted = this.toBinary(encipheredText);
            let result = TYPE + btoa(converted);
            this.setState({
                resultReference: result
            });
            let keyObject = JSON.stringify({
                key: key
            });
            let convertedKey = this.toBinary(keyObject);
            let keyRef = TYPE + btoa(convertedKey);
            this.setState({
                keyReference: keyRef,
                saveFileBtnDisabled: false,
                saveKeyBtnDisabled: false
            });
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

    render() {
        return (
            <React.Fragment>
                <div className="plain-uploading">
                    <p>Загрузите файл, который Вы хотите зашифровать:</p>
                    <input id="load-dec" type="file" onInput={this.handleFileInput} />
                </div>
                <div className="key-gen">
                    <p>Сгенерируйте ключ шифрования:</p>
                    <input type="text" id="keygen-input" readOnly value={this.state.keyWord}/>
                    <input type="button" id="keygen-button" value="Сгенерировать" onClick={this.handleKeyGen}  disabled={this.state.disabled}/>
                </div>
                <div className="encipher">
                    <p>Чтобы зашифровать файл по сгенерированному ключу, нажмите на кнопку:</p>
                    <input type="button" id="encode-button" value="Зашифровать" onClick={this.handleEncode} disabled={this.state.encodeBtnDisabled} />
                </div>
                <div className="process-indicator" id="encode-progress"></div>
                <div className="enciphered-downloading">
                    <a id="enciphered-txt-link" download="enciphered.txt" href={this.state.resultReference}>
                        <input type="button" id="download-encoded" value="Скачать зашифрованный файл" disabled={this.state.saveFileBtnDisabled} />
                    </a>
                    <a id="key-txt-link" download="key.json" href={this.state.keyReference}>
                        <input type="button" id="download-key" value="Сохранить ключ" disabled={this.state.saveKeyBtnDisabled} />
                    </a>
                </div> 
            </React.Fragment>
        );
    }
}
