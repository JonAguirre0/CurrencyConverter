const dropDownContent = document.querySelector('.dropDown-content')
const dropDownBtn = document.querySelector('.dropDownBtn')
const option1 = document.querySelector('.option1')
const dropDownContent2 = document.querySelector('.dropDown2-content')
const dropDownBtn2 = document.querySelector('.dropDownBtn2')
const option2 = document.querySelector('.option2')
const input = document.querySelector('.input')
const convertBtn  = document.querySelector('.convert-container')
const resultContent = document.querySelector('.result-container')
const conversionRate = document.querySelector('.conversion-rate')
const conversionResult = document.querySelector('.conversion-result')
const symbol = document.querySelector('.symbol')

let isConvert = false

dropDownBtn.addEventListener('click', () => {
    option1.value = ''
    dropDownContent.classList.toggle('show')
})
dropDownContent.addEventListener('click', () => {
    dropDownContent.classList.remove('show')
})

dropDownBtn2.addEventListener('click', () => {
    option2.value = ''
    dropDownContent2.classList.toggle('show')
})
dropDownContent2.addEventListener('click', () => {
    dropDownContent2.classList.remove('show')
})

input.addEventListener('focus', () => {
    input.value = ''
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

input.addEventListener('blur', () => {
    
    let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ''))
    if (!isNaN(value)) {
        input.value = currencyFormatter.format(value)
    } else {
        input.value = ''
    }
})

const API = 'http://localhost:5502'
type = 'codes'

async function fetchAndDisplay() {
    let url = `/${type}`

    if (isConvert) {
        const choice1 = option1.value;
        const choice2 = option2.value;
        const numValue = input.value
        const amount = numValue.replace(/[^\d.]/g, '')
        console.log('choice1 from fetchAndDisplay:', choice1)
        console.log('choice2: from fetchAndDisplay', choice2)
        console.log('amount: from fetchAndDisplay', amount)

        url += `?choice1=${encodeURIComponent(choice1)}&choice2=${encodeURIComponent(choice2)}&amount=${encodeURIComponent(amount)}`;
    }
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (isConvert) {
            showConvert(data);
        } else {
            showCurrencies(data);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }

}

function showCurrencies(currency) {
    const { supported_codes } = currency

    dropDownContent.innerHTML = ''
    dropDownContent2.innerHTML = ''

    supported_codes.forEach(([code, name]) => {
        const fromLink = document.createElement('a')
        fromLink.href = `#${code}`
        fromLink.textContent = `${code} - ${name}`
        dropDownContent.appendChild(fromLink)

        const toLink = document.createElement('a')
        toLink.href = `#${code}`
        toLink.textContent = `${code} - ${name}`
        dropDownContent2.appendChild(toLink)
    })

    dropDownContent.querySelectorAll('a').forEach(option => {
        option.addEventListener('click', () => {
            const code = option.href.split('#')[1]
            option1.value = code
            dropDownContent.classList.remove('show')
        })
    })

    dropDownContent2.querySelectorAll('a').forEach(selection => {
        selection.addEventListener('click', () => {
            const code = selection.href.split('#')[1]
            const name = selection.textContent.split(' - ')[1]
            option2.value = code
            option3.value = name
            dropDownContent2.classList.remove('show')
        })
    })

} 

//below is temporary
const option3 = document.querySelector('.option3')
function showConvert(result) {
    const { conversion_rate, conversion_result}  = result

    conversionRate.textContent = conversion_rate
    conversionResult.textContent = conversion_result
    //symbol.textContent = option3.value
    conversionResult.textContent += " - " + option3.value
    console.log(symbol.innerHTML)
}

// function showSymbol(result) {
//     const { display_symbol } = result

//     conversionResult.textContent = display_symbol
// }

convertBtn.addEventListener('click', () => {
    conversionRate.textContent = ''
    // conversionResult.textContent = ''
    isConvert = true
    type = 'convert'

    const choice1 = option1.value
    const choice2 = option2.value
    const amount = input.value
    console.log('choice1:', choice1)
    console.log('choice2:', choice2)
    console.log('amount:', amount)

    fetchAndDisplay(type)
    resultContent.classList.add('show')
})

window.addEventListener('DOMContentLoaded', fetchAndDisplay)

window.onload = () => {
    document.querySelector('.option1').value = ''
    document.querySelector('.option2').value = ''
    document.querySelector('.input').value = ''
}