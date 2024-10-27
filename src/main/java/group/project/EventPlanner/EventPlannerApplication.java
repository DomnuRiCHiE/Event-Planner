package group.project.EventPlanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class EventPlannerApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventPlannerApplication.class, args);
	}

}
