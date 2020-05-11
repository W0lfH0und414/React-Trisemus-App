import React from 'react';
import Encipher from './Encipher';
import Decipher from './Decipher';
import table from './images/Trisemus-table-cut.png'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            huy: true
        }
    }
    render () {
        return (
            <React.Fragment>
                <aside className="left-aside"></aside>
                <div className="main-content">
                    <nav>
                        <span>ASIS LABS INC.</span>
                        <span className="span-registered">®</span>
                        <ul>
                            <a href="#encipher" className="encipher-link"><li>Зашифровать</li></a>
                            <a href="#decipher" className="decipher-link"><li>Расшифровать</li></a>
                        </ul>
                    </nav>
                    <div className="intro">
                        <h2>Шифрующие таблицы Трисемуса</h2>
                        <p>
                            В 1508 г. аббат из Германии Иоганн Трисемус написал печатную работу по криптологии под названием «Полиграфия».
                            В этой книге он впервые систематически описал применение шифрующих таблиц, заполненных алфавитом в случайном 
                            порядке. Для получения такого шифра замены обычно использовались таблица для записи букв алфавита и ключевое 
                            слово (или фраза). В таблицу сначала вписывалось по строкам ключевое слово, причем повторяющиеся буквы
                            отбрасывались. Затем эта таблица дополнялась не вошедшими в нее буквами алфавита по порядку.
                            На рис. 1 изображена таблица с ключевым словом «ДЯДИНА».
                        </p>
                        <img src={table} alt="Trisemus table"></img>
                        <p className="image-description">Рис.1. Шифрующая таблица Трисемуса</p>
                        <p>
                            Каждая буква открытого сообщения заменяется буквой, расположенной под ней в том же столбце. Если буква
                            находится в последней строке таблицы, то для ее шифрования берут самую верхнюю букву столбца. Например,
                            исходное сообщение «АБРАМОВ», зашифрованное – «ЖЗЦЖУФЙ».
                        </p>
                    </div>
                    <h3 id="encipher">Шифрование текстовых файлов методом таблиц Трисемуса</h3>
                    <Encipher />
                    <h3 id="decipher">Дешифрование текстовых файлов методом таблиц Трисемуса</h3>
                    <Decipher />
                </div>
                <aside className="right-aside"></aside>
            </React.Fragment>
        );
    }  
}