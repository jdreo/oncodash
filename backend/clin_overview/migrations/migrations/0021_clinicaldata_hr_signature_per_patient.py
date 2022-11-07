# Generated by Django 3.2.16 on 2022-11-03 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clin_overview', '0020_auto_20221103_1245'),
    ]

    operations = [
        migrations.AddField(
            model_name='clinicaldata',
            name='hr_signature_per_patient',
            field=models.CharField(choices=[('HRD', 'HRD'), ('HRP', 'HRP')], max_length=100, null=True),
        ),
    ]
