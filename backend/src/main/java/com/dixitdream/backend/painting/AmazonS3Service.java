package com.dixitdream.backend.painting;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.util.Date;

import static java.lang.String.format;

@Service
public abstract class AmazonS3Service {

    private AmazonS3 s3client;

    @Value("${aws.s3Url}")
    private String s3Url;
    @Value("${aws.bucketName}")
    private String bucketName;
    @Value("${aws.accessKey}")
    private String accessKey;
    @Value("${aws.secretKey}")
    private String secretKey;
    @Value("${aws.region}")
    private String awsRegion;

    @PostConstruct
    private void initializeAmazon() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(this.accessKey, this.secretKey);
        this.s3client = AmazonS3ClientBuilder.standard()
                .withRegion(Regions.fromName(awsRegion))
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }

    public String getFileUrl(String filePath) {
        return format("https://%s.%s/%s", bucketName, s3Url, filePath);
    }

    public String getFilePath(Long userId) {
        return format("%d/%d", userId, new Date().getTime());
    }

    public void deleteObject(String filePath) {
        s3client.deleteObject(bucketName, filePath);
    }

    public void putObject(String filePath, File file) {
        s3client.putObject(new PutObjectRequest(bucketName, filePath, file)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }
}