import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {
  assignment?: Assignment;
  // champs du formulaire
  nomAssignment?: string;
  dateDeRendu?: Date;
  note?: number
  remarque?: string = ''

  constructor(private route: ActivatedRoute, private router: Router, private assignmentService: AssignmentsService,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    // exemple de récupération de "query params" et "fragment"
    // exemple d'URL : /assignment/1/edit?nom=Buffa&prenom=Michel#edit
    console.log("QUERY PARAMS : ");
    console.log(this.route.snapshot.queryParams);
    console.log("FRAGMENT : ");
    console.log(this.route.snapshot.fragment);

    this.getAssignment();
  }

  getAssignment() {
    // récupère l'id dans l'URL
    const id = +this.route.snapshot.params['id'];

    this.assignmentService.getAssignment(id)
      .subscribe(data => {
        // Pour que la "vue" affiche les informations
        // de l'assignment qu'on édite....
        const assignment = data?.assignment
        this.assignment = assignment;
        // pré-remplit le formulaire dès l'affichage
        this.nomAssignment = assignment?.nom;
        this.dateDeRendu = assignment?.dateDeRendu;
        this.note = assignment?.note
        this.remarque = assignment?.remarques
      })
  }

  onSaveAssignment() {
    if (!this.assignment) return;

    if (this.nomAssignment) {
      this.assignment.nom = this.nomAssignment;
    }

    if (this.dateDeRendu) {
      this.assignment.dateDeRendu = this.dateDeRendu;
    }

    if (this.note) {
      this.assignment.note = this.note;
    }

    if (this.remarque) {
      this.assignment.remarques = this.remarque;
    }

    this.assignmentService
      .updateAssignment(this.assignment)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });

    this.snackbar.open(this.assignment.nom + " a été modifié", '', {
      duration: 3000
    })
  }
}
