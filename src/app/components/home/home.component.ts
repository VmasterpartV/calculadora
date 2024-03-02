import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  calculatorForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.calculatorForm = this.formBuilder.group({
      result: ['']
    });
  }

  appendToResult(value: string) {
    const currentValue = this.calculatorForm.get('result').value;
    this.calculatorForm.get('result').setValue(currentValue + value);
  }

  clearResult() {
    this.calculatorForm.get('result').setValue('');
  }

  calculateResult() {
    let expression = this.calculatorForm.get('result').value;

    // Reemplazar símbolos específicos para evaluar correctamente
    expression = expression.replace('√', 'Math.sqrt(');
    expression = expression.replace('^', '**');

    // Agregar paréntesis de cierre
    const openParenthesis = (expression.match(/\(/g) || []).length;
    const closeParenthesis = (expression.match(/\)/g) || []).length;
    const difference = openParenthesis - closeParenthesis;
    for (let i = 0; i < difference; i++) {
      expression += ')';
    }

    console.log(expression);

    // split the expression into single operations
    const operations = expression.split(/(\+|\-|\*|\/)/);
    // iterate over the operations and replace the log() function with the correct value
    for (let i = 0; i < operations.length; i++) {
      console.log(operations[i]);
      if (operations[i].includes('log(') && operations[i].includes(',')) {
        // split base and value by comma
        const base = operations[i].split('log(')[1].split(',')[0];
        const value = operations[i].split('log(')[1].split(',')[1].replace(')', '');
        operations[i] = operations[i].replace(base, '');
        operations[i] = operations[i].replace(value, '');
        operations[i] = operations[i].replace(',', '');
        operations[i] = operations[i].replace(')', '');
        operations[i] = this.getBaseLog(base, value);
      } else if (operations[i].includes('log(')) {
        const base = operations[i].split('log(')[1].replace(')', '');
        operations[i] = operations[i].replace(base, '');
        operations[i] = operations[i].replace(')', '');
        operations[i] = this.getBaseLog(10, base);
      }
    }

    // join the operations back together
    expression = operations.join('');
    console.log(expression);

    // Evaluar la expresión modificada
    try {
      const result = eval(expression);
      if (Number.isNaN(result)) {
        this.calculatorForm.get('result').setValue('ERROR');
      } else {
        this.calculatorForm.get('result').setValue(result);
      }
    }
    catch (error) {
      this.calculatorForm.get('result').setValue('Error');
    }
  }

  getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

  delLastDigit() {
    const currentValue = this.calculatorForm.get('result').value;
    this.calculatorForm.get('result').setValue(currentValue.slice(0, -1));
  }
}
